import { db } from "@/app/db/client";
import { chatBotMetaData, conversations, messages } from "@/app/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { eq, inArray, desc } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const bots = await db.select().from(chatBotMetaData).where(eq(chatBotMetaData.user_email, user.email));

        if (bots.length === 0) {
            return NextResponse.json(
                {
                    conversations: []
                }
            )
        }

        const botIds = bots.map((bot) => bot.id);
        const convs = await db.select().from(conversations).where(inArray(conversations.chatbot_id, botIds)).orderBy(desc(conversations.createdAt));

        const data = await Promise.all((convs.map(async (c) => {
            const [lastMsg] = await db.select().from(messages).where(eq(messages.conversation_id, c.id)).orderBy(desc(messages.createdAt)).limit(1);
            let timeDisplay = "";
            const ts = lastMsg?.createdAt || c.createdAt;

            if (ts) {
                const date = new Date(ts);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);

                if (diffMins < 60) {
                    timeDisplay = `${diffMins}m ago`;
                } else if (diffHours < 24) {
                    timeDisplay = `${diffHours}h ago`;
                } else {
                    timeDisplay = date.toLocaleDateString();
                }

                return {
                    id: c.id,
                    user: c.name || "visitor",
                    lastMessage: lastMsg?.content || "Started Conversation",
                    time: timeDisplay,
                    status: "active",
                    visitor_ip: c.visitor_ip
                }
            }
            return null; // Explicit null for filtering
        })))

        const filteredData = data.filter(Boolean);

        return NextResponse.json(
            {
                conversations: filteredData
            },
            {
                status: 200
            }
        )

    } catch (e) {
        console.error("Metadata fetch error", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )

    }
}