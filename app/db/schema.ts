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