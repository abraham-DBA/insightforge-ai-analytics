import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { chatBotMetaData, conversations, sections, metadata } from "@/app/db/schema";
import { eq, count, inArray, desc } from "drizzle-orm";
import { knowledge_source } from "@/app/db/schema";
import { messages } from "@/app/db/schema";


export async function GET() {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const [metaDataRecord] = await db
            .select()
            .from(metadata)
            .where(eq(metadata.user_email, user.email));

        const bots = await db.select().from(chatBotMetaData).where(eq(chatBotMetaData.user_email, user.email));

        const botsIds = bots?.map((bot) => bot.id);

        const ks = await db
            .select({
                type: knowledge_source.type,
                count: count()
            })
            .from(knowledge_source)
            .where(eq(knowledge_source.user_email, user.email))
            .groupBy(knowledge_source.type);

        const knowledgeStats = {
            website: 0,
            upload: 0,
            text: 0,
            total: 0
        };

        ks.forEach((k) => {
            if (k.type === "website") {
                knowledgeStats.website += k.count;
            } else if (k.type === "upload") {
                knowledgeStats.upload += k.count;
            } else if (k.type === "text") {
                knowledgeStats.text += k.count;
            }
            knowledgeStats.total += k.count;
        });

        const recentSections = await db
            .select().from(sections)
            .where(eq(sections.user_email, user.email))

        const sectionStats = {
            total: recentSections.length,
            list: recentSections.map((s) => ({
                name: s.name,
                sourceCount: s.source_ids.length,
                tone: s.tone,
            }))
        }

        const [totalSectionsResult] = await db
            .select({
                value: count()
            }).from(sections)
            .where(eq(sections.user_email, user.email));
        sectionStats.total = totalSectionsResult.value;


        let recentChats: { title: string; snippet: string; time: string }[] = [];

        let totalConversations = 0;

        if (botsIds.length > 0) {
            const rawConv = await db.select().from(conversations)
                .where(inArray(conversations.chatbot_id, botsIds))
                .orderBy(desc(conversations.createdAt))
                .limit(5);

            totalConversations = rawConv.length;

            recentChats = await Promise.all(rawConv.map(async (c) => {
                const [lastMsg] = await db
                    .select()
                    .from(messages)
                    .where(eq(messages.conversation_id, c.id))
                    .orderBy(desc(messages.createdAt))
                    .limit(1)

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
                }

                return {
                    title: c.name || "visitor Chat",
                    snippet: lastMsg?.content || "Started Conversation",
                    time: timeDisplay
                }
            }));

            if (totalConversations === 5) {
                const [t] = await db
                    .select({ value: count() })
                    .from(conversations)
                    .where(inArray(conversations.chatbot_id, botsIds));
                totalConversations = t.value;
            }

            return NextResponse.json({
                botId: botsIds[0] || null,
                hasMetadata: !!metaDataRecord,
                knowledge: knowledgeStats,
                sections: sectionStats,
                chats: recentChats,
                counts: {
                    conversations: totalConversations,
                    sections: sectionStats.total,
                    knowledge: knowledgeStats.total
                }
            })
        }

        return NextResponse.json({
            botId: null,
            hasMetadata: !!metaDataRecord,
            knowledge: knowledgeStats,
            sections: sectionStats,
            chats: [],
            counts: {
                conversations: 0,
                sections: sectionStats.total,
                knowledge: knowledgeStats.total
            }
        })



    } catch (error) {
        console.error("Overview fetch error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )

    }
}