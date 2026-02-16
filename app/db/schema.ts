import {pgTable, text} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";

export const user = pgTable("user", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    organizational_id: text("organizational_id").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    image: text("image"),
    created_at: text("created_at").default(sql`now()`),
})

export const session = pgTable("session", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    organizationalId: text("organizational_id").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").default(sql`now()`),
})

export const metadata = pgTable("metadata", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    business_name: text("business_name").notNull(),
    website_url: text("website_url").notNull(),
    external_links: text("external_links"),
    created_at: text("created_at").default(sql`now()`),
})

export const knowledge_source = pgTable("knowledge_source", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    type: text("type").notNull(),
    name: text("name").notNull(),
    status: text("status").notNull().default("active"),
    source_url: text("source_url"),
    content: text("content"),
    metadata: text("metadata"),
    last_updated_at: text("last_updated_at").default(sql`now()`),
    created_at: text("created_at").default(sql`now()`),
})

export const sections = pgTable("sections", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    tone: text("tone").notNull(),
    allowed_topics: text("allowed_topics"),
    blocked_topics: text("blocked_topics"),
    source_ids: text("source_ids").array().notNull(),
    status: text("status").notNull().default("active"),
    created_at: text("created_at").default(sql`now()`),
})

export const chatBotMetaData = pgTable("chatBotMetaData", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    color: text("color").default("#4f39f6"),
    welcome_message: text("welcome_message")
    .default("Hi! I'm your AI assistant. Which area would you like to explore today?"),
    created_at: text("created_at").default(sql`now()`),
})
