import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/isAuthorized";
import { db } from "@/app/db/client";
import { metadata } from "@/app/db/schema";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const user = await isAuthorized();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { business_name, website_url, external_links } = await req.json();

        if (!business_name || !website_url) {
            return NextResponse.json(
                { error: "Missing business name or website url" },
                { status: 400 }
            );
        }

        const metadataResponse = await db.insert(metadata).values({
            user_email: user.email,
            business_name,
            website_url,
            external_links
        });

        const cookieStore = await cookies();
        cookieStore.set("metadata", JSON.stringify({ business_name }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
            sameSite: "lax"
        });

        return NextResponse.json(
            { metadataResponse },
            { status: 201 }
        )
    } catch (error) {
        console.error("Metadata store error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}