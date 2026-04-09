import { db } from "@/app/db/client";
import { chatBotMetaData } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function POST(req: Request) {
    const origin = req.headers.get("origin") || "";
    
    // Default CORS headers for response
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    try {
        const {widget_id} = await req.json();

        if(!widget_id) {
            return NextResponse.json({error: "Widget ID is required"}, {status: 400, headers: corsHeaders});
        }

        // Verify widget exists 
        const [bot] = await db
            .select().from(chatBotMetaData)
            .where(eq(chatBotMetaData.id, widget_id))
            .limit(1);

        if(!bot) {
            return NextResponse.json({error: "Widget not found"}, {status: 404, headers: corsHeaders});
        }

        // --- SECURITY: Domain Whitelisting ---
        // If allowed_domains is set, we check the origin
        if (bot.allowed_domains && bot.allowed_domains.length > 0) {
            const isAllowed = bot.allowed_domains.some(domain => {
                // simple substring check or regex could be better, but start simple
                return origin.includes(domain.replace(/^https?:\/\//, ''));
            });

            if (!isAllowed) {
                console.warn(`[Blocked] Unauthorized origin: ${origin} for widget ${widget_id}`);
                return NextResponse.json({error: "Unauthorized domain"}, {status: 403, headers: corsHeaders});
            }
        }

        // Create session
        const  secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const sessionId = crypto.randomUUID();

        const token = await new SignJWT({widgetId: bot.id, ownerEmail: bot.user_email, sessionId})
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt(Date.now() / 1000)
        .setExpirationTime("2h")
        .sign(secret);

        return NextResponse.json({token}, {headers: corsHeaders});    
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error"}, {status: 500, headers: corsHeaders});
    }
}