import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const app = body.app || 'unknown app'

  const guide = `OAuth setup guide for ${app}

This is a placeholder guide.
Replace this with real generation later.

Steps:
1. Go to the developer console.
2. Create a new app.
3. Add redirect URL.
4. Copy Client ID and Client Secret.`

  return NextResponse.json({ guide })
}
