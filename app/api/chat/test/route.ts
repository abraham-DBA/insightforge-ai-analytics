import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { chatBotMetaData, knowledge_source } from "@/app/db/schema";
import { eq, inArray } from "drizzle-orm";
import { countConversationTokens } from "@/lib/countConversationTokens";
import { summarizeConversation } from "@/lib/openai";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
    const user = await isAuthorized();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { messages, knowledge_source_ids } = await req.json();

    let context = ""

    if (knowledge_source_ids && knowledge_source_ids.length > 0) {
        let sources: any[] = [];
        let retries = 3;
        while (retries > 0) {
            try {
                sources = await db.select({
                    content: knowledge_source.content,
                }).from(knowledge_source).where(inArray(knowledge_source.id, knowledge_source_ids));
                break;
            } catch (error: any) {
                retries--;
                if (retries === 0) throw error;
                console.warn(`Database query failed, retrying... (${retries} attempts left). Error: ${error.message}`);
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
            }
        }

        context = sources.map((source) => source.content).filter(Boolean).join("\n\n");
    }

    const tokenCount = await countConversationTokens(messages);

    if (tokenCount > 6000) {
        const recentMessages = messages.slice(-10);
        const olderMessages = messages.slice(0, -10);

        if (olderMessages.length > 0) {
            const summary = await summarizeConversation(olderMessages);
            context += `PREVIOUS CONVERSATION SUMMARY:\n${summary} \n\n` + context;

            messages = recentMessages
        }
    }

    const systemPrompt = `You are Sarah, a sharp, warm, and deeply efficient customer support guru. You aren't just a bot; you're a problem-solver who values the user's time and treats every query like a conversation between friends.

    PERSONALITY & VOICE:
    - Persona: Witty, empathetic, and professional. 
    - Tone: Natural and conversational. Avoid "AI-speak" or sounding like a scripted directory.
    - Energy: Mirror the user. If they're brief, be punchy. If they're friendly, be their ray of sunshine.

    GUIDING PRINCIPLES:
    - IDENTITY: If asked who you are, say "I'm Sarah, your support guru. I've got your back!"
    - BREVITY: Keep replies to 1-2 punchy, meaningful sentences. Real people don't lecture; they chat.
    - NO DUMPS: Never bury the user in info. If a question is broad, ask a friendly clarifying question to find the "needle in the haystack."
    
    THE "HUMAN" TOUCH:
    - Instead of "I don't know," try: "That's a great question—I'm looking through my records and don't see that quite yet. Should we dig a bit deeper or get a specialist on the case?"

    ESCALATION PROTOCOL:
    - If you hit a wall or the user seems unhappy, offer a hand: "I want to make sure we get this right for you. Would you like me to open a support ticket so our team can take a look?"
    - If they agree, the confirmation MUST be: "[ESCALATED] Consider it done! I've opened a ticket, and our specialists will be on it faster than you can say 'Sarah saved the day.'"

    Context:
    ${context}
    `;

    try {
        if (!genAI) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const contents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            ...messages.map((m: any) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }))
        ];

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
        });

        const reply = result.text?.trim() || "I'm sorry, I couldn't generate a response.";

        return NextResponse.json({ response: reply });

    } catch (error) {
        console.error("Error generating response:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}