import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";
import { db } from "@/app/db/client";
import { teamMembers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import scalekit from "@/lib/scalekit";

export async function POST(req: Request) {
    try {
        const loggedInUser = await isAuthorized();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { email, name } = await req.json();

        if(!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const pendingMemebers = await db.select().from(teamMembers).where(eq(teamMembers.user_email, email));

        if(pendingMemebers.length > 0) {
            return NextResponse.json({ error: "Member is already invited" }, { status: 400 })
        }

        const {user} = await scalekit.user.createUserAndMembership(loggedInUser.organizational_id, {
            email: email,
            userProfile: {
                firstName: name || email.split("@")[0],
                lastName: "",
            },
            sendInvitationEmail: true,
            
        })

        await db.insert(teamMembers).values({
            name: name || email.split("@")[0],
            user_email: email,
            organizational_id: loggedInUser.organizational_id,
        })

        return NextResponse.json({ user }, { status: 201 });

    } catch (error) {
        console.error("Failed to add team member", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}