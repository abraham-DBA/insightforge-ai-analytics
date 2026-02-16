import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenAI({ apiKey });

export async function countTokens(text: string): Promise<number> {
    const result = await genAI.models.countTokens({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text }] }]
    });
    return result.totalTokens ?? 0;
}

export async function countConversationTokens(messages: { role: string; content: string }[]): Promise<number> {
    const contents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));

    const result = await genAI.models.countTokens({
        model: "gemini-2.5-flash",
        contents
    });
    return result.totalTokens ?? 0;
}