import { teamMembers } from "@/app/db/schema";
import scalekit from "@/lib/scalekit";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headers = Object.fromEntries(req.headers.entries());
        const secret = process.env.SCALEKIT_WEBHOOK_SECRET!;

        try {
            scalekit.verifyWebhookPayload(secret, headers, body);
        } catch (error) {
            console.error("Webhook verification failed", error);
            return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
        }

        const event = JSON.parse(body);
        switch (event.type) {
            case "user.organization_membership_created":
                const param = event.data;
                await db.update(teamMembers).set({
                    status: "active",
                }).where(eq(teamMembers.user_email, param.user.email));
                break;

            default:
                console.log("Unknown webhook event type", event.type);
                break;
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Failed to process webhook", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
