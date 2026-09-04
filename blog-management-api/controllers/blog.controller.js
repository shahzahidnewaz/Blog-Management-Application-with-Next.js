import { Op } from "sequelize";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import { isValidId, validateBlogInput, isNonEmptyString } from "../validators/validators.js";

const AUTHOR_INCLUDE = {
    model: User,
    as: "author",
    attributes: ["id", "firstname", "lastname", "image"],
};

export const createBlog = async (req, res) => {
    try {
        const { blogTitle, blog, category } = req.body;

        const errors = validateBlogInput({ blogTitle, blog });
        if (errors.length > 0) {
            return res.status(400).json({ message: errors.join(", ") });
        }

        const newBlog = await Blog.create({
            userId: req.user.id,
            blogTitle: blogTitle.trim(),
            blog: blog.trim(),
            category: isNonEmptyString(category) ? category.trim() : null,
        });

        return res.status(201).json({
            message: "Blog created successfully",
            data: newBlog,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create blog", error: error.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const { title, category } = req.query;
        const where = {};

        if (isNonEmptyString(title)) {
            where.blogTitle = { [Op.like]: `%${title.trim()}%` };
        }
        if (isNonEmptyString(category)) {
            where.category = { [Op.like]: `%${category.trim()}%` };
        }

        const blogs = await Blog.findAll({
            where,
            include: [AUTHOR_INCLUDE],
            order: [["createAt", "DESC"]],
        });

        return res.status(200).json({
            message: "Blogs retrieved successfully",
            data: blogs,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve blogs", error: error.message });
    }
};


export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid blog id" });
        }

        const blog = await Blog.findByPk(id, { include: [AUTHOR_INCLUDE] });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            message: "Blog retrieved successfully",
            data: blog,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve blog", error: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { blogTitle, blog, category } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid blog id" });
        }

        const existingBlog = await Blog.findByPk(id);
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const isOwner = existingBlog.userId === req.user.id;
        const isAdminUser = req.user.role === "admin";
        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ message: "You are not authorized to update this blog." });
        }

        if (blogTitle !== undefined) {
            if (!isNonEmptyString(blogTitle)) {
                return res.status(400).json({ message: "blogTitle cannot be empty" });
            }
            existingBlog.blogTitle = blogTitle.trim();
        }

        if (blog !== undefined) {
            if (!isNonEmptyString(blog)) {
                return res.status(400).json({ message: "blog content cannot be empty" });
            }
            existingBlog.blog = blog.trim();
        }

        if (category !== undefined) {
            existingBlog.category = isNonEmptyString(category) ? category.trim() : null;
        }

        await existingBlog.save();

        return res.status(200).json({
            message: "Blog updated successfully",
            data: existingBlog,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update blog", error: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidId(id)) {
            return res.status(400).json({ message: "Invalid blog id" });
        }

        const existingBlog = await Blog.findByPk(id);
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const isOwner = existingBlog.userId === req.user.id;
        const isAdminUser = req.user.role === "admin";
        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ message: "You are not authorized to delete this blog." });
        }

        await existingBlog.destroy();

        return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete blog", error: error.message });
    }
};