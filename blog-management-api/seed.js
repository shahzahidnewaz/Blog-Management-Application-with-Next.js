import bcrypt from "bcrypt";
import sequelize from "./config/db.js";
import User from "./models/user.model.js";
import Blog from "./models/blog.model.js";

const SALT_ROUNDS = 10;
const SEED_PASSWORD = "Password123";

const users = [
    { firstname: "Admin", lastname: "User", email: "admin@blogspace.local", role: "admin" },
    { firstname: "John", lastname: "Doe", email: "john@blogspace.local", role: "user" },
    { firstname: "Sarah", lastname: "Khan", email: "sarah@blogspace.local", role: "user" },
    { firstname: "Alex", lastname: "Rivera", email: "alex@blogspace.local", role: "user", isActive: false },
];

const blogsByEmail = {
    "john@blogspace.local": [
        {
            blogTitle: "Getting Started with Playwright",
            category: "Testing",
            blog: "Playwright is a modern browser automation framework that supports Chromium, Firefox, and WebKit with a single API. In this post we walk through installing Playwright, writing your first test, and running it in headed and headless modes. We also cover auto-waiting, which removes most of the flaky-test problems teams hit with older tools.",
        },
        {
            blogTitle: "Automating API Tests with Postman and Newman",
            category: "Automation",
            blog: "Postman collections aren't just for manual exploration - paired with Newman, they become a full API test suite you can run in CI. This post covers structuring a collection with environments, writing assertions in the test tab, and wiring Newman into a GitHub Actions pipeline so every pull request is verified automatically.",
        },
    ],
    "sarah@blogspace.local": [
        {
            blogTitle: "A Practical Guide to REST API Design",
            category: "Programming",
            blog: "Good REST API design comes down to a handful of consistent decisions: predictable resource naming, sensible use of HTTP verbs and status codes, and pagination that scales. This post walks through real examples of each, along with common mistakes that make an API painful for the developers who have to consume it.",
        },
        {
            blogTitle: "CI/CD Pipelines Explained",
            category: "DevOps",
            blog: "A CI/CD pipeline automates the path from a code commit to a running deployment. We break down the typical stages - build, test, and deploy - and look at how tools like GitHub Actions, Jenkins, and GitLab CI implement each stage differently, along with tips for keeping pipelines fast and reliable.",
        },
    ],
    "admin@blogspace.local": [
        {
            blogTitle: "How Large Language Models Are Changing Software Testing",
            category: "AI",
            blog: "AI-assisted tools are increasingly showing up in QA workflows, from generating test cases out of user stories to flagging likely regressions in a diff. This post looks at where these tools genuinely save time today, where they still need a human in the loop, and how teams can start experimenting without over-relying on them.",
        },
    ],
};

async function seed() {
    await sequelize.authenticate();
    console.log("Connected to the database.");

    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);
    const createdUsers = {};

    for (const userData of users) {
        const [user, created] = await User.findOrCreate({
            where: { email: userData.email },
            defaults: { ...userData, password: hashedPassword },
        });
        createdUsers[userData.email] = user;
        console.log(`${created ? "Created" : "Already exists"}: ${userData.email} (${userData.role})`);
    }

    for (const [email, blogs] of Object.entries(blogsByEmail)) {
        const author = createdUsers[email];
        for (const blogData of blogs) {
            const [, created] = await Blog.findOrCreate({
                where: { blogTitle: blogData.blogTitle, userId: author.id },
                defaults: { ...blogData, userId: author.id },
            });
            console.log(`  ${created ? "Created" : "Already exists"} blog: "${blogData.blogTitle}"`);
        }
    }

    console.log("\nSeeding complete.");
    console.log(`All seeded users share the password: ${SEED_PASSWORD}`);
    console.log("Admin login: admin@blogspace.local");
    console.log("Deactivated user (for testing login-blocked flow): alex@blogspace.local");

    await sequelize.close();
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});