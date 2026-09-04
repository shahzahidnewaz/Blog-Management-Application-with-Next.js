import { Router } from "express";
import authMiddleware, { isAdmin } from "../middleware/auth.middleware.js";
import uploadProfileImage from "../middleware/upload.middleware.js";
import {
    getAllUsers,
    getUserById,
    updateUserStatus,
    getOwnProfile,
    updateOwnProfile,
    updateOwnPassword,
    updateProfileImage,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", authMiddleware, getOwnProfile);
router.put("/profile/update", authMiddleware, updateOwnProfile);
router.patch("/profile/image", authMiddleware, uploadProfileImage, updateProfileImage);
router.patch("/password", authMiddleware, updateOwnPassword);

router.get("/", authMiddleware, isAdmin, getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getUserById);
router.patch("/:id/status", authMiddleware, isAdmin, updateUserStatus);

export default router;
