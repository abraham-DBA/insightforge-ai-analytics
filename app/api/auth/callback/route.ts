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

    if(error) {
        return NextResponse.json({error, error_description}, {status: 401});
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

        if (existing.length === 0) {
            await db.insert(User).values({
                name: user?.name || "anonymous",
                email: user.email,
                organizational_id: organizationId,
            });
        }

        const response = NextResponse.redirect(new URL("/dashboard", req.url));
        const userSession = {
            email: user.email,
            organizational_id: organizationId,
        };
        
        response.cookies.set("user_session", JSON.stringify(userSession), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60*60*24*7
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