'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(url, key)
}

type Audience = 'just_me' | 'team' | 'public'

export default function Home() {
  const [guides, setGuides] = useState<any[]>([])
  const [audience, setAudience] = useState<Audience>('just_me')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const supabase = getSupabase()
      supabase
        .from('guides')
        .select('app_name, slug, status, content')
        .then(({ data, error }) => {
          if (error) setError(error.message)
          else setGuides(data || [])
          setLoading(false)
        })
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }, [])

  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (loading) return <div className="p-8">Loading...</div>

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">OAuth Setup Guides</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Who is this for?</label>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value as Audience)}
          className="border rounded px-3 py-2"
        >
          <option value="just_me">Just me (testing)</option>
          <option value="team">My team</option>
          <option value="public">Public users</option>
        </select>
        <p className="text-sm text-gray-600 mt-2 max-w-2xl">
          Switching audiences instantly surfaces real-world constraints — moving from instant local testing (Just me) to multi-workspace security reviews (Public).
        </p>
      </div>

      {guides.map((guide) => {
        const c = guide.content
        const summary = c.summary?.[audience]

        const steps = audience === 'just_me'
          ? (c.steps || []).slice(0, 10)
          : (c.steps || [])

        const blockers = (c.blockers || []).filter((b: any) =>
          b.applies_to?.includes(audience) ||
          b.applies_to?.includes('all') ||
          (audience === 'just_me' && b.applies_to?.includes('just_me'))
        )

        const developerTime =
          audience === 'just_me' ? '15–30 min' :
          audience === 'team' ? '30–60 min' : '1–2 hours'

        const slackApprovalTime =
          audience === 'just_me' ? 'None' :
          audience === 'team' ? 'None to a few hours (if admin approval)' :
          'Up to 10 business days + up to 10 weeks'

        return (
          <div key={guide.slug} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{guide.app_name}</h2>

            <div className="bg-gray-50 border rounded p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div><strong>Status</strong><br />{guide.status}</div>
              <div><strong>Difficulty</strong><br />{summary?.difficulty || '—'}</div>
              <div><strong>Developer time</strong><br />{developerTime}</div>
              <div><strong>Slack approval time</strong><br />{slackApprovalTime}</div>
              <div><strong>Review needed</strong><br />{summary?.review || '—'}</div>
            </div>

            <h3 className="text-lg font-medium mb-2">Data every developer needs</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Data</th>
                    <th className="border p-2 text-left">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border p-2">OAuth supported</td><td className="border p-2">{c.core_data?.oauth_supported}</td></tr>
                  <tr>
                    <td className="border p-2">Developer page</td>
                    <td className="border p-2">
                      <a href={c.core_data?.developer_page} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        {c.core_data?.developer_page}
                      </a>
                    </td>
                  </tr>
                  <tr><td className="border p-2">Registration fields</td><td className="border p-2">{c.core_data?.registration_fields}</td></tr>
                  <tr><td className="border p-2">Keys you get back</td><td className="border p-2">{c.core_data?.keys_you_get_back}</td></tr>
                  <tr><td className="border p-2">Redirect address rules</td><td className="border p-2">{c.core_data?.redirect_address_rules}</td></tr>
                  <tr><td className="border p-2">Scopes</td><td className="border p-2">{c.core_data?.scopes}</td></tr>
                  <tr><td className="border p-2">Token life and renewal</td><td className="border p-2">{c.core_data?.token_life_and_renewal}</td></tr>
                  <tr><td className="border p-2">Agent vs you</td><td className="border p-2">{c.core_data?.agent_vs_you}</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium mb-2">
              Steps {audience === 'just_me' ? '(tested path)' : '(from docs)'}
            </h3>
            <ol className="list-decimal list-inside space-y-1 mb-6">
              {steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            {c.tested && audience === 'just_me' && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-sm">
                <strong>Tested:</strong> {c.tested.date} by {c.tested.who}<br />
                <strong>What was seen:</strong> {c.tested.what_was_seen}
              </div>
            )}

            <h3 className="text-lg font-medium mb-2">Blockers for this audience</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Blocker</th>
                    <th className="border p-2 text-left">What it means</th>
                    <th className="border p-2 text-left">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {blockers.length === 0 ? (
                    <tr><td className="border p-2" colSpan={3}>Not checked for this audience.</td></tr>
                  ) : (
                    blockers.map((b: any, i: number) => (
                      <tr key={i}>
                        <td className="border p-2">{b.name}</td>
                        <td className="border p-2">{b.meaning}</td>
                        <td className="border p-2">{b.evidence || 'SOURCED'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium mb-2">Agent vs Human</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Setup level</th>
                    <th className="border p-2 text-left bg-blue-50">What the agent can do</th>
                    <th className="border p-2 text-left bg-amber-50">What you must do</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-medium">App provisioning</td>
                    <td className="border p-2 bg-blue-50">Parse required scopes. Prefill redirect schemas. Construct authorization URLs.</td>
                    <td className="border p-2 bg-amber-50">Log in to Slack Developer Console. Create the app. Copy Client ID and Client Secret. Enter and save Redirect URLs.</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">Single workspace<br />(Just me)</td>
                    <td className="border p-2 bg-blue-50">Generate token exchange requests. Make API calls with the bot token.</td>
                    <td className="border p-2 bg-amber-50">Click Install to Workspace. Approve the consent screen.</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">Multi-workspace<br />(Team / Public)</td>
                    <td className="border p-2 bg-blue-50">Implement callback route handlers. Enforce state token validation. Store tokens by team_id.</td>
                    <td className="border p-2 bg-amber-50">Turn on distribution. Provision HTTPS for callbacks. Submit for Marketplace review (public).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-sm text-gray-600 border-t pt-4 space-y-1">
              <div><strong>Sources:</strong></div>
              {audience === 'just_me' && (
                <div>
                  <a href="https://docs.slack.dev/authentication/installing-with-oauth/" target="_blank" rel="noreferrer" className="text-blue-600 underline">Installing with OAuth</a>
                  {' '}(tested path)
                </div>
              )}
              {audience === 'team' && (
                <div>
                  <a href="https://docs.slack.dev/authentication/installing-with-oauth/" target="_blank" rel="noreferrer" className="text-blue-600 underline">Installing with OAuth</a>
                  {' '}(team path: distribution and admin approval)
                </div>
              )}
              {audience === 'public' && (
                <>
                  <div>
                    <a href="https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/" target="_blank" rel="noreferrer" className="text-blue-600 underline">Slack Marketplace review guide</a>
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>Official requirements:</strong> App fully functional and publicly available. Tested on a non-dev workspace (including uninstall). Installed on 10+ active workspaces. Preliminary review up to 10 business days. Functional review up to 10 weeks. Submit from app settings. Provide test accounts and a video demo.
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </main>
  )
}