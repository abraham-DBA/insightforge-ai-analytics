import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/isAuthorized";
import { summarizeMarkdown } from "@/lib/openai";
import { db } from "@/app/db/client";
import { knowledge_source } from "@/app/db/schema";

export async function POST(req: NextRequest) {
    try {
        const user = await isAuthorized();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const contentType = req.headers.get("content-type") || "";
        let type: string = "";
        let body: any = {};

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            type = (formData.get("type") as string) || "";

            if (type === "upload") {
                const file = formData.get("file") as File | null;
                if (!file) {
                    return NextResponse.json(
                        { error: "File is required for upload type" },
                        { status: 400 }
                    );
                }

                const fileContent = await file.text();
                const lines = fileContent.split("\n").filter((line) => line.trim());
                const headers = lines[0]?.split(",").map((header) => header.trim());

                let formattedContent: any = "";
                const markdown = await summarizeMarkdown(fileContent);
                formattedContent = markdown;

                const rowCount = Math.max(0, lines.length - 1);
                await db.insert(knowledge_source).values({
                    user_email: user.email,
                    type: "upload",
                    name: file.name,
                    status: "active",
                    content: formattedContent,
                    metadata: JSON.stringify({
                        fileName: file.name,
                        fileSize: file.size,
                        rowCount,
                        headers: headers ?? []
                    })
                });
                return NextResponse.json(
                    { message: "CSV file uploaded successfully" },
                    { status: 200 }
                )
            }
        } else {
            body = await req.json();
            type = body.type;
        }

        if (!["upload", "website", "text"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid type. Must be 'upload', 'website', or 'text'" },
                { status: 400 }
            );
        }

        if (type === "upload") {

            return NextResponse.json(
                { error: "Upload type requires multipart/form-data" },
                { status: 400 }
            );
        }

        if (type === "website") {
            if (!body.url) {
                return NextResponse.json(
                    { error: "URL is required for website type" },
                    { status: 400 }
                );
            }
            const zenUrl = new URL("https://api.zenrows.com/v1/");
            const apiKey = process.env.ZENROWS_API_KEY;
            if (!apiKey) {
                console.error("ZENROWS_API_KEY is not configured");
                return NextResponse.json(
                    { error: "Internal Server Error" },
                    { status: 500 }
                );
            }
            zenUrl.searchParams.set("apikey", apiKey);
            zenUrl.searchParams.set("url", body.url);
            zenUrl.searchParams.set("response_type", "markdown");

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15_000);
            try {
                const res = await fetch(zenUrl.toString(), {
                    headers: {
                        "User-Agent": "InsightForgebot/1.0"
                    },
                    signal: controller.signal
                });
                const html = await res.text();

                if (!res.ok) {
                    let errorMessage = "ZenRows request failed";
                    try {
                        const errorJson = JSON.parse(html);
                        if (errorJson.detail) errorMessage = `ZenRows: ${errorJson.detail}`;
                    } catch (e) { }

                    return NextResponse.json(
                        { error: errorMessage },
                        { status: 400 }
                    )
                }

                const markdown = await summarizeMarkdown(html);

                await db.insert(knowledge_source).values({
                    user_email: user.email,
                    type: "website",
                    name: body.url,
                    status: "active",
                    source_url: body.url,
                    content: markdown,
                })
            } finally {
                clearTimeout(timeout);
            }

        } else if (type === "text") {
            if (!body.content || !body.title) {
                return NextResponse.json(
                    { error: "Content and title are required for text type" },
                    { status: 400 }
                );
            }
            let content = body.content;

            if (body.content.length > 500) {
                const markdown = await summarizeMarkdown(body.content);
                content = markdown;
            }
            await db.insert(knowledge_source).values({
                user_email: user.email,
                type: "text",
                name: body.title,
                status: "active",
                content: content,
            });
        }

        return NextResponse.json(
            { message: "Source added successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error storing knowledge source:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}