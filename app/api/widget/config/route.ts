import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/app/db/client";
import { chatBotMetaData, sections } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
        const {searchParams} = new URL(req.url);
        const token = searchParams.get("token");

        if(!token) {
            return NextResponse.json({error: "Token is required"}, {status: 400});
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
                    return NextResponse.json({error: "Bot not found"}, {status: 404});
                }

                const userSections = await 
                db.select().from(sections).where(eq(sections.user_email, ownerEmail))

                return NextResponse.json({
                    metadata,
                    sections: userSections
                })
            
            
        } catch (error) {
            
        }
}