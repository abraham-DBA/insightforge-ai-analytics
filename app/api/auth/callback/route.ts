import {NextRequest, NextResponse} from "next/server";
import scalekit from "@/lib/scalekit";
import {db} from "@/app/db/client";
import {user as User} from "@/app/db/schema"
import {eq} from "drizzle-orm";

export async function GET(req: NextRequest) {
    const {searchParams} = req.nextUrl;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");
    const state = searchParams.get("state");
    const stateCookie = req.cookies.get("sk_state")?.value;

    if(error) {
        return NextResponse.json({error, error_description}, {status: 401});
    }
    
    // CSRF validation - MUST pass before proceeding with code exchange
    if (!state || !stateCookie || state !== stateCookie) {
        return NextResponse.json({ error: "Invalid state - CSRF validation failed" }, { status: 401 });
    }
    
    if(!code) {
        return NextResponse.json({error: "No code provided"}, {status: 400});
    }

    try{
        const redirectUrl = process.env.SCALEKIT_REDIRECT_URL
        if (!redirectUrl) {
            return new Response("Missing SCALEKIT_REDIRECT_URL", { status: 500 })
        }

        const authResult = await scalekit.authenticateWithCode(code, redirectUrl);

        const {user, idToken} = authResult;
        if (!user?.email) {
            return NextResponse.json(
                { error: "No email returned from identity provider" },
                { status: 400 }
            );
        }

        const claims = await scalekit.validateToken(idToken);

        const organizationId =
            (claims as any).organization_id ||
            (claims as any).org_id ||
            (claims as any).oid ||
            null ;

        if(!organizationId) {
            return NextResponse.json(
                {error: "No organization id found in token claims"},
                {status: 500}
            );
        }

        const existing = await db
            .select()
            .from(User)
            .where(eq(User.email, user.email));

        let userId: string;
        if (existing.length === 0) {
            const result = await db.insert(User).values({
                name: user?.name || "anonymous",
                email: user.email,
                organizational_id: organizationId,
            }).returning({ id: User.id });
            userId = result[0].id;
        } else {
            userId = existing[0].id;
        }

        // Create secure session token
        const { createSession } = await import("@/lib/session");
        const sessionId = await createSession(userId, organizationId);

        const response = NextResponse.redirect(new URL("/dashboard", req.url));
        response.cookies.set("sk_state", "", { path: "/", maxAge: 0 });
        
        response.cookies.set("user_session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (e) {
        console.error("Error exchanging code:", e);
        return NextResponse.json(
            {error: "Failed to authenticate user"},
            {status: 500}
        )

    }
}