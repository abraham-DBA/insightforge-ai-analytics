import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { conversations, chatBotMetaData, messages } from "@/app/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: conversationId } = await params;

        const [conv] = await db.select().from(conversations).where(eq(conversations.id, conversationId));

        if (!conv) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const [bot] = await db.select().from(chatBotMetaData).where(and(eq(chatBotMetaData.id, conv.chatbot_id), eq(chatBotMetaData.user_email, user.email)));

        if (!bot) {
            return NextResponse.json({ error: "Forbidden" }, { status: 404 });
        }

        const msgs = await db.select().from(messages).where(eq(messages.conversation_id, conversationId)).orderBy(asc(messages.createdAt));

        return NextResponse.json({ messages: msgs }, { status: 200 });

    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}