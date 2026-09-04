import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import User from "../models/user.model.js";
import { isValidId, isValidPassword, isNonEmptyString } from "../validators/validators.js";

const SALT_ROUNDS = 10;
const PUBLIC_ATTRIBUTES = { exclude: ["password"] };

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: PUBLIC_ATTRIBUTES });
        return res.status(200).json({
            message: "Users retrieved successfully",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const user = await User.findByPk(id, { attributes: PUBLIC_ATTRIBUTES });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve user", error: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }
        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive must be a boolean value" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = isActive;
        await user.save();

        return res.status(200).json({
            message: `User has been ${isActive ? "activated" : "deactivated"} successfully`,
            data: {
                id: user.id,
                email: user.email,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update user status", error: error.message });
    }
};

export const getOwnProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: PUBLIC_ATTRIBUTES });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "Profile retrieved successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve profile", error: error.message });
    }
};

export const updateOwnProfile = async (req, res) => {
    try {
        const { firstname, lastname } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (firstname !== undefined) {
            if (!isNonEmptyString(firstname)) {
                return res.status(400).json({ message: "firstname cannot be empty" });
            }
            user.firstname = firstname.trim();
        }

        if (lastname !== undefined) {
            if (!isNonEmptyString(lastname)) {
                return res.status(400).json({ message: "lastname cannot be empty" });
            }
            user.lastname = lastname.trim();
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            data: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                image: user.image,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

export const updateProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file was uploaded" });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const previousImage = user.image;

        user.image = `/uploads/profile-images/${req.file.filename}`;
        await user.save();

        if (previousImage) {
            const previousPath = path.join(process.cwd(), previousImage);
            fs.unlink(previousPath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.warn(`Failed to remove old profile image: ${previousPath}`, err.message);
                }
            });
        }

        return res.status(200).json({
            message: "Profile image updated successfully",
            data: {
                id: user.id,
                image: user.image,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update profile image", error: error.message });
    }
};

export const updateOwnPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!isValidPassword(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update password", error: error.message });
    }
};
