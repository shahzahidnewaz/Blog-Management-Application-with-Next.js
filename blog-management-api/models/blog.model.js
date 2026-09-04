import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

const Blog = sequelize.define(
    "Blog",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        blogTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        blog: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "blogs",
        timestamps: true,
        createdAt: "createAt",
        updatedAt: "updateAt",
    }
);

Blog.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(Blog, { foreignKey: "userId", as: "blogs" });

export default Blog;