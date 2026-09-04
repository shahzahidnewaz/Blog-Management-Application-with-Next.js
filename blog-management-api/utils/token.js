import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
};
