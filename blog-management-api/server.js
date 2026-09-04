import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/db.js";
import "./models/user.model.js";
import "./models/blog.model.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established");

        await sequelize.sync({ alter: true });
        console.log("Models synced");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error);
        process.exit(1);
    }
};

startServer();
