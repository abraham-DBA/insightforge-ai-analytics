import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
    }
const genAI = new GoogleGenAI({ apiKey });


// -----------------------------
// SUMMARIZE MARKDOWN
// -----------------------------
export async function summarizeMarkdown(markdown: string) {
    try {
        const prompt = `
You are a data summarization engine for an AI chatbot.

Your task:

- Convert the input website markdown or text or csv files data into a CLEAN, DENSE SUMMARY for LLM context usage.

STRICT RULES:

- Output ONLY plain text (no markdown, no bullet points, no headings).
- Write as ONE continuous paragraph.
- Remove navigation, menus, buttons, CTAs, pricing tables, sponsors, ads, testimonials, community chats, UI labels, emojis, and decorative content.
- Remove repetition and marketing language.
- Keep ONLY factual, informational content that helps answer customer support questions.
- Do NOT copy sentences verbatim unless absolutely necessary.
- Compress aggressively while preserving meaning.
- The final output MUST be under 2000 words.

INPUT:
${markdown}
`;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        });

        return result.text?.trim() || "";
    } catch (error) {
        console.error("Error in summarizeMarkdown:", error);
        throw error;
    }
}


// -----------------------------
// SUMMARIZE CONVERSATION
// -----------------------------
export async function summarizeConversation(messages: any[]) {
    try {
        const conversationText = messages
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n");

        const prompt = `
Summarize the following conversation history into a concise paragraph, preserving key details and user intent. The final output MUST be under 2000 words.

${conversationText}
`;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }]
        });

        return result.text?.trim() || "";
    } catch (error) {
        console.error("Error in summarizeConversation:", error);
        throw error;
    }
}