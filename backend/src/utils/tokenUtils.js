import jwt from "jsonwebtoken";

export const generateTokens = (userId, email) => {
    const accessToken = jwt.sign(
        { id: userId, email },
        process.env.ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
};
