import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
}

export default defineConfig({
    schema: ["./app/db/**/*.ts"],
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    }
});
