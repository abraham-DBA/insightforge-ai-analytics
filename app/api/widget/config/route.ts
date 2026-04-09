import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/app/db/client";
import { chatBotMetaData, sections } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

export async function GET(req: Request) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const {searchParams} = new URL(req.url);
    const token = searchParams.get("token");

    if(!token) {
        return NextResponse.json({error: "Token is required"}, {status: 400, headers: corsHeaders});
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const {payload} = await jwtVerify(token, secret);

        const widgetId = payload.widgetId as string;
        const ownerEmail = payload.ownerEmail as string;

        const [metadata] = await db
            .select()
            .from(chatBotMetaData)
            .where(eq(chatBotMetaData.id, widgetId))
            .limit(1)

            if(!metadata) {
                return NextResponse.json({error: "Bot not found"}, {status: 404, headers: corsHeaders});
            }

            const userSections = await 
            db.select().from(sections).where(eq(sections.user_email, ownerEmail))

            return NextResponse.json({
                metadata,
                sections: userSections
            }, {headers: corsHeaders})
        
        
    } catch (error) {
        return NextResponse.json({error: "Failed to load config"}, {status: 500, headers: corsHeaders});
    }
}