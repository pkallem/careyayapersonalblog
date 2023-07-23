import {pgTable, serial, text, varchar, integer} from "drizzle-orm/pg-core"
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const userblogs = pgTable("userblogs", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    content: text("content"),
    user_id: integer("user_id"),
    author: varchar("author")
})

export const db = drizzle(sql);

