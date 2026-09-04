import bcrypt from "bcrypt";
import crypto from "crypto";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import {
    validateRegisterInput,
    validateLoginInput,
    validateForgotPasswordInput,
    validateResetPasswordInput,
} from "../validators/validators.js";

const SALT_ROUNDS = 10;
const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const errors = validateRegisterInput({ firstname, lastname, email, password });
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        }

        const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (existingUser) {
            return res.status(409).json({
                message: "A user with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong during registration", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const errors = validateLoginInput({ email, password });
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        }

        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "This account has been deactivated" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        return res.status(200).json({
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong during login", error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const errors = validateForgotPasswordInput({ email });
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        }

        const genericMessage =
            "If an account with that email exists, a password reset link has been sent.";

        const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!user) {
            return res.status(200).json({ message: genericMessage });
        }

        const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const resetUrl = `${frontendUrl}/reset-password/${rawToken}`;

        await sendPasswordResetEmail({ to: user.email, resetUrl });

        return res.status(200).json({ message: genericMessage });
    } catch (error) {
        return res.status(500).json({ message: "Failed to process password reset request", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const errors = validateResetPasswordInput({ password });
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        }

        if (!token) {
            return res.status(400).json({ message: "Reset token is required" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ message: "This reset link is invalid or has expired" });
        }

        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to reset password", error: error.message });
    }
};