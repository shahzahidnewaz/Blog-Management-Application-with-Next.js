import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} from "../controllers/blog.controller.js";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

router.post("/create", authMiddleware, createBlog);
router.put("/update/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.delete("/delete/:id", authMiddleware, deleteBlog);

export default router;