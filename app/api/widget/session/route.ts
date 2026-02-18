import { db } from "@/app/db/client";
import { chatBotMetaData } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: Request) {
    try {
        const {widget_id} = await req.json();

        if(!widget_id) {
            return NextResponse.json({error: "Widget ID is required"}, {status: 400});
        }

        // Verify widget exists 
        const [bot] = await db
            .select().from(chatBotMetaData)
            .where(eq(chatBotMetaData.id, widget_id))
            .limit(1);

        if(!bot) {
            return NextResponse.json({error: "Widget not found"}, {status: 404});
        }

        // Create session
        const  secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const sessionId = crypto.randomUUID();

        const token = await new SignJWT({widgetId: bot.id, ownerEmail: bot.user_email, sessionId})
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt(Date.now() / 1000)
        .setExpirationTime("2h")
        .sign(secret);

        return NextResponse.json({token});    
    } catch (error) {
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}