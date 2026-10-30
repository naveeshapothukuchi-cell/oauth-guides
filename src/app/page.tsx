'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase environment variables')
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

  if (error) return <div className="min-h-screen bg-zinc-950 text-red-400 p-10">{error}</div>
  if (loading) return <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">Loading...</div>

  const guide = guides.find((g) => g.slug === 'slack') || guides[0]
  if (!guide) return <div className="min-h-screen bg-zinc-950 text-zinc-400 p-10">No guides found.</div>

  const c = guide.content
  const summary = c.summary?.[audience]
  const steps = audience === 'just_me' ? (c.steps || []).slice(0, 10) : (c.steps || [])
  const blockers = (c.blockers || []).filter((b: any) =>
    b.applies_to?.includes(audience) || b.applies_to?.includes('all')
  )

  const developerTime = audience === 'just_me' ? '15–30 min' : audience === 'team' ? '30–60 min' : '1–2 hours'
  const slackApprovalTime = audience === 'just_me' ? 'None' : audience === 'team' ? 'None to a few hours (if admin approval)' : 'Up to 10 business days + up to 10 weeks'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-zinc-950 font-bold text-sm">&gt;_</div>
          <div>
            <div className="font-semibold tracking-wide text-sm">OAUTH_SETUP_GUIDES</div>
            <div className="text-xs text-zinc-500">DEVELOPER REFERENCE SYSTEM</div>
          </div>
        </div>
        <div className="text-xs text-emerald-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          LIBRARY ONLINE
        </div>
      </header>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="text-emerald-400 text-xs tracking-widest mb-4">// OAUTH CONFIGURATION MANUAL</div>
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Stop guessing<br />
          <span className="text-zinc-500">OAuth schemas.</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8">Clear, deterministic OAuth setup roadmaps for developers and AI agent builders.</p>

        <div className="mt-6 flex items-center gap-3 text-sm">
          <span className="text-zinc-500">WHO WILL CONNECT TO YOUR APP?</span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm"
          >
            <option value="just_me">Just me (Personal testing / Solo builder)</option>
            <option value="team">My team</option>
            <option value="public">Public users</option>
          </select>
        </div>
        <p className="text-xs text-zinc-500 mt-2 max-w-2xl">
          Switching audiences instantly surfaces real-world constraints — moving from instant local testing (Just me) to multi-workspace security reviews (Public).
        </p>
      </section>

      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="text-emerald-400 text-xs tracking-widest mb-4">01 / LIBRARY INDEX</div>
        <h2 className="text-2xl font-semibold mb-6">Predefined providers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Figma', 'Google Drive', 'Notion', 'Slack'].map((name) => (
            <div
              key={name}
              className={`border rounded-lg p-4 ${name === 'Slack' ? 'border-emerald-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold">{name[0]}</div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400">
                  {name === 'Slack' ? 'VERIFIED' : 'SOURCED'}
                </span>
              </div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {name === 'Slack' ? 'Workspaces, channels, and messages' : 'Coming soon'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="text-emerald-400 text-xs tracking-widest mb-4">02 / ACTIVE GUIDE / SLACK</div>
        <h2 className="text-3xl font-semibold mb-2">{guide.app_name}</h2>
        <p className="text-zinc-400 mb-8">OAuth 2.0 setup path with audience-specific constraints.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 text-sm">
          {[
            ['Status', guide.status],
            ['Difficulty', summary?.difficulty || '—'],
            ['Developer time', developerTime],
            ['Slack approval time', slackApprovalTime],
            ['Review needed', summary?.review || '—'],
          ].map(([label, value]) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-zinc-500 text-xs">{label}</div>
              <div className="mt-1 font-medium">{value}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-3">Data every developer needs</h3>
        <div className="overflow-x-auto border border-zinc-800 rounded-lg mb-8">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left p-3 font-medium">Field</th>
                <th className="text-left p-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr><td className="p-3 text-zinc-400">OAuth supported</td><td className="p-3">{c.core_data?.oauth_supported}</td></tr>
              <tr>
                <td className="p-3 text-zinc-400">Developer page</td>
                <td className="p-3">
                  <a href={c.core_data?.developer_page} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                    {c.core_data?.developer_page}
                  </a>
                </td>
              </tr>
              <tr><td className="p-3 text-zinc-400">Registration fields</td><td className="p-3">{c.core_data?.registration_fields}</td></tr>
              <tr><td className="p-3 text-zinc-400">Keys you get back</td><td className="p-3">{c.core_data?.keys_you_get_back}</td></tr>
              <tr><td className="p-3 text-zinc-400">Redirect rules</td><td className="p-3">{c.core_data?.redirect_address_rules}</td></tr>
              <tr><td className="p-3 text-zinc-400">Scopes</td><td className="p-3">{c.core_data?.scopes}</td></tr>
              <tr><td className="p-3 text-zinc-400">Token life</td><td className="p-3">{c.core_data?.token_life_and_renewal}</td></tr>
              <tr><td className="p-3 text-zinc-400">Agent vs you</td><td className="p-3">{c.core_data?.agent_vs_you}</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium mb-3">Steps {audience === 'just_me' ? '(tested path)' : '(from docs)'}</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-300 mb-8">
          {steps.map((step: string, i: number) => <li key={i}>{step}</li>)}
        </ol>

        {c.tested && audience === 'just_me' && (
          <div className="bg-emerald-950/30 border border-emerald-900 rounded-lg p-4 text-sm mb-8">
            <div className="font-medium text-emerald-400">Tested {c.tested.date} by {c.tested.who}</div>
            <div className="text-zinc-300 mt-1">{c.tested.what_was_seen}</div>
          </div>
        )}

        <h3 className="text-lg font-medium mb-3">Blockers for this audience</h3>
        <div className="overflow-x-auto border border-zinc-800 rounded-lg mb-8">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left p-3 font-medium">Blocker</th>
                <th className="text-left p-3 font-medium">What it means</th>
                <th className="text-left p-3 font-medium">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {blockers.length === 0 ? (
                <tr><td className="p-3 text-zinc-500" colSpan={3}>Not checked for this audience.</td></tr>
              ) : blockers.map((b: any, i: number) => (
                <tr key={i}>
                  <td className="p-3">{b.name}</td>
                  <td className="p-3 text-zinc-300">{b.meaning}</td>
                  <td className="p-3 text-emerald-400">{b.evidence || 'SOURCED'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium mb-3">Agent vs Human</h3>
        <div className="overflow-x-auto border border-zinc-800 rounded-lg mb-8">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left p-3 font-medium">Setup level</th>
                <th className="text-left p-3 font-medium text-sky-400">What the agent can do</th>
                <th className="text-left p-3 font-medium text-amber-400">What you must do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr>
                <td className="p-3 font-medium">App provisioning</td>
                <td className="p-3 text-zinc-300">Parse required scopes. Prefill redirect schemas. Construct authorization URLs.</td>
                <td className="p-3 text-zinc-300">Log in to Slack Developer Console. Create the app. Copy Client ID and Client Secret. Enter and save Redirect URLs.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Single workspace<br />(Just me)</td>
                <td className="p-3 text-zinc-300">Generate token exchange requests. Make API calls with the bot token.</td>
                <td className="p-3 text-zinc-300">Click Install to Workspace. Approve the consent screen.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Multi-workspace<br />(Team / Public)</td>
                <td className="p-3 text-zinc-300">Implement callback route handlers. Enforce state token validation. Store tokens by team_id.</td>
                <td className="p-3 text-zinc-300">Turn on distribution. Provision HTTPS for callbacks. Submit for Marketplace review (public).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-sm text-zinc-500 border-t border-zinc-800 pt-4 space-y-1">
          <div className="font-medium text-zinc-400">Sources</div>
          {audience === 'just_me' && (
            <div>
              <a href="https://docs.slack.dev/authentication/installing-with-oauth/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                Installing with OAuth
              </a>
              {' '}(tested path)
            </div>
          )}
          {audience === 'team' && (
            <div>
              <a href="https://docs.slack.dev/authentication/installing-with-oauth/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                Installing with OAuth
              </a>
              {' '}(team path: distribution and admin approval)
            </div>
          )}
          {audience === 'public' && (
            <>
              <div>
                <a href="https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  Slack Marketplace review guide
                </a>
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                Official requirements: App fully functional and publicly available. Tested on a non-dev workspace (including uninstall). Installed on 10+ active workspaces. Preliminary review up to 10 business days. Functional review up to 10 weeks.
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}