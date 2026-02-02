import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});


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

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text().trim();
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

        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text().trim();
    } catch (error) {
        console.error("Error in summarizeConversation:", error);
        throw error;
    }
}
