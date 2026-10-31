import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const app = (body.app || 'Unknown app').trim()

  const guide = `OAuth setup guide for ${app}

Audience: Just me / My team / Public users

DEVELOPER TIME
- Just me: 15–45 min
- My team: 30–90 min
- Public users: 1–3 hours + provider review

PROVIDER APPROVAL TIME
- Just me: None
- My team: None to a few hours (admin approval may apply)
- Public users: Hours to weeks

STEPS
1. Open the developer console for ${app} and sign in.
2. Create a new app or integration.
3. Enter an app name and select a development workspace or organization.
4. Add an HTTPS redirect URL.
5. Choose the scopes you need (start with the minimum).
6. Create the app and copy the Client ID and Client Secret.
7. Install or authorize the app in your own workspace to test.
8. For team or public use: enable distribution or public access and complete any review steps.

BLOCKERS TO CHECK
- Redirect URL must be HTTPS.
- Some apps require admin approval before others can connect.
- Public listings usually need review, privacy policy, and extra assets.
- Token lifetime and refresh rules differ by provider.

AGENT VS HUMAN
Agent can: read the docs, suggest scopes, build the authorize URL, and draft the callback handler.
You must: log in, create the app, copy the keys, save the redirect URL, and complete the install or consent step.

EVIDENCE
Generated from common OAuth patterns. Confirm every step against the official ${app} developer documentation before you ship.
`

  return NextResponse.json({ guide })
}