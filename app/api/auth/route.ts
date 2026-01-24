import crypto from "crypto"
import { cookies } from "next/headers"
import scalekit from "@/lib/scalekit"
import {NextResponse} from "next/dist/server/web/spec-extension/response";

export async function GET(): Promise<Response> {
  try {
    const state = crypto.randomBytes(16).toString("hex")

    const cookieStore = await cookies()
    cookieStore.set("sk_state", state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    const redirectUrl = process.env.SCALEKIT_REDIRECT_URL
    if (!redirectUrl) {
      return new Response("Missing SCALEKIT_REDIRECT_URL", { status: 500 })
    }

    const options = {
      scopes: ["openid", "profile", "email", "offline_access"],
      state,
    }

    const authorizationUrl = scalekit.getAuthorizationUrl(redirectUrl, options)

    return NextResponse.redirect(authorizationUrl)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
        {error: "Failed to generate authorization url"},
        {status: 500}
    );
  }
}