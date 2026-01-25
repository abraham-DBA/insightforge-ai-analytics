``` markdown
# Security Implementation Documentation

## Overview
This document outlines the critical security issues identified and resolved in the InsightForge authentication system. These implementations protect against common web vulnerabilities including CSRF attacks, session hijacking, and token tampering.

---

## 1. Session Token Management (Critical Fix)

### Issue
Previously, sensitive user data (email and organizational_id) was stored directly in client-side cookies, making the application vulnerable to:
- **Session tampering**: Attackers could modify cookie values to impersonate other users
- **Information disclosure**: PII exposed in cookies
- **Token forgery**: No server-side validation of token authenticity

### Solution: Opaque Session Tokens
Implemented a secure server-side session store using opaque random tokens.

#### Implementation Details

**Database Schema** (`app/db/schema.ts`):
```

typescript export const session = pgTable("session", { id: text("id").primaryKey().default(sqlgen_random_uuid()), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), organizationalId: text("organizational_id").notNull(), expiresAt: text("expires_at").notNull(), createdAt: text("created_at").default(sqlnow()), })```

**Session Utilities** (`lib/session.ts`):
- `createSession()`: Generates cryptographically secure random sessionId, persists with expiry
- `validateSession()`: Verifies token exists, checks expiry, confirms user/org still active
- `deleteSession()`: Explicit session cleanup

**Security Features**:
- ✅ Random 64-character hex tokens (`crypto.randomBytes(32).toString("hex")`)
- ✅ 7-day expiration with database-enforced validation
- ✅ Cascade deletion when users are removed
- ✅ Server-side lookup prevents tampering
- ✅ Expired sessions automatically cleaned up

**Cookie Configuration** (`app/api/auth/callback/route.ts`):
```

typescript response.cookies.set("user_session", sessionId, { httpOnly: true, // JavaScript cannot access secure: process.env.NODE_ENV === "production", // HTTPS only in production sameSite: "lax", // CSRF protection path: "/", maxAge: 60 * 60 * 24 * 7 // 7 days });``` 

---

## 2. CSRF Protection via State Parameter Validation (Critical Fix)

### Issue
OAuth 2.0 authorization flow susceptible to Cross-Site Request Forgery (CSRF) attacks where:
- Attacker tricks user into clicking malicious link
- Authorization code sent to attacker's redirect URI
- Attacker gains access to victim's account

### Solution: OAuth 2.0 State Parameter Validation
Implemented cryptographically secure state parameter validation.

**State Generation** (`app/api/auth/route.ts`):
```

typescript const state = crypto.randomBytes(16).toString("hex") cookieStore.set("sk_state", state, { httpOnly: true, sameSite: "lax", path: "/" })```

**State Validation in Callback** (`app/api/auth/callback/route.ts`):
```

typescript const state = searchParams.get("state"); const stateCookie = req.cookies.get("sk_state")?.value;
if (!state || !stateCookie || state !== stateCookie) { return NextResponse.json({ error: "Invalid state - CSRF validation failed" }, { status: 401 }); }``` 

**Security Features**:
- ✅ Random 32-character hex state per authorization request
- ✅ Server-side verification before code exchange
- ✅ Rejects mismatched or missing state (401 response)
- ✅ Single-use state (cleared after validation)
- ✅ httpOnly flag prevents JavaScript access

---

## 3. Missing Function Return Statement (Critical Bug)

### Issue
`isAuthorized()` function did not return the user object, making authorization checks always return `undefined`.

### Solution
Added explicit return statement in `lib/isAuthorized.ts`:
```

typescript export const isAuthorized = async () => { const cookieStore = await cookies(); const sessionId = cookieStore.get("user_session")?.value;
if (!sessionId) return null;

try {
const user = await validateSession(sessionId);
return user;  // ← CRITICAL: Return user data
} catch (e) {
console.error("Failed to validate session:", e);
return null;
}
}```

---

## Security Best Practices Implemented

### Cookie Security Flags
| Flag | Purpose |
|------|---------|
| `httpOnly` | Prevents XSS attacks accessing token via JavaScript |
| `secure` | HTTPS-only transmission (production) |
| `sameSite: lax` | Prevents CSRF while allowing safe cross-site requests |
| `path: /` | Scope limited to entire application |
| `maxAge` | Automatic expiration (7 days for sessions) |

### Session Lifecycle
1. User initiates login → State generated & stored in cookie
2. OAuth provider redirects → State validated server-side
3. Authorization code exchanged → Secure sessionId created
4. SessionId persisted in database → Linked to user
5. Only opaque token stored in cookie → Client cannot tamper
6. Session validated on every protected request → Server lookup
7. Session expires → Automatic cleanup → User must re-login

---

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email **security@insightforge.com** with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

**Please do not disclose the vulnerability publicly until a fix has been released.**

### Response Timeline
- **24 hours**: Acknowledgment of receipt
- **7 days**: Assessment and prioritization
- **30 days**: Target fix release for critical vulnerabilities

---

## Database Migrations Required

Run Drizzle migrations to create the session table:
```

bash npm run db:generate # Generate migration npm run db:migrate # Apply migration to database``` 

---

## Environment Variables Required
```

env SCALEKIT_REDIRECT_URL=https://yourdomain.com/api/auth/callback NODE_ENV=production DATABASE_URL=postgresql://...```

---

## Related Files

| File | Purpose |
|------|---------|
| `lib/session.ts` | Session creation & validation utilities |
| `lib/isAuthorized.ts` | Authorization check with server validation |
| `app/api/auth/route.ts` | OAuth state generation & redirect |
| `app/api/auth/callback/route.ts` | State validation & code exchange |
| `app/db/schema.ts` | Database schema with session table |

---

## References

- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [OWASP: Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
- [OWASP: Session Management](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/README)
- [MDN: HTTP Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)

---

**Last Updated**: January 2026 
**Status**: ✅ All critical security issues resolved and documented
```
