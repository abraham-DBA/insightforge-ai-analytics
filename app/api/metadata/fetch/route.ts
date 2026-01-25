import {isAuthorized} from "@/lib/isAuthorized";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {db} from "@/app/db/client";
import {metadata} from "@/app/db/schema"; // Import the table schema, not metadata from layout
import {eq} from "drizzle-orm";

export async function GET(request: Request) {
    try{
        const user = await isAuthorized();

        if(!user) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const cookieStore = await cookies()
        const metaDataCookie = cookieStore.get("metadata")

        if(metaDataCookie?.value) {
            try {
                const parsedData = JSON.parse(metaDataCookie.value);
            return NextResponse.json(
                {
                    exists: true,
                    source: "cookie",
                    data: parsedData,
                },
                {status: 200}
            );
                } catch {
                // Invalid cookie data, fall through to database query
            }
        }

        const [record] = await db
            .select()
            .from(metadata)
            .where(eq(metadata.user_email, user.email));

        if(record) {
            cookieStore.set(
                "metadata",
                JSON.stringify(record),
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: "/",
                    sameSite: "lax"
                }
            );
            return NextResponse.json(
                {
                    exists: true,
                    source: "database",
                    data: record,
                },
                {status: 200}
            )
        }

        return NextResponse.json(
            {
                exists: false,
                data: null
            },
            {
                status: 200
            }
        )

    } catch (e) {
        console.error("Metadata fetch error", e);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )

    }
}