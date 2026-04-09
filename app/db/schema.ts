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
    allowed_domains: text("allowed_domains").array(),
    created_at: text("created_at").default(sql`now()`),
})

export const teamMembers = pgTable("team_members", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    name: text("name").notNull(),
    organizational_id: text("organizational_id").notNull(),
    role: text("role").notNull().default("member"),
    status: text("status").notNull().default("pending"),
    created_at: text("created_at").default(sql`now()`),
})

export const conversations = pgTable("conversations", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    visitor_ip: text("visitor_ip"),
    name: text("name"),
    chatbot_id: text("chatbot_id").notNull(),
    createdAt: text("created_at").default(sql`now()`),
})

export const messages = pgTable("messages", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    conversation_id: text("conversation_id").notNull(),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: text("created_at").default(sql`now()`),
})

export const widgets = pgTable("widgets", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    Organization_id: text("user_email").notNull(),
    name: text("name").notNull(),
    allowed_domains: text("allowed_domains").array(),
    status: text("status").notNull().default("active"),
    created_at: text("created_at").default(sql`now()`),
})
