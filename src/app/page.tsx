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
  const [selectedSlug, setSelectedSlug] = useState<string>('slack')
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

  const guide = guides.find((g) => g.slug === selectedSlug) || guides[0]
  if (!guide) return <div className="min-h-screen bg-zinc-950 text-zinc-400 p-10">No guides found.</div>

  const c = guide.content
  const summary = c.summary?.[audience]
  const steps = audience === 'just_me' ? (c.steps || []).slice(0, 10) : (c.steps || [])
  const blockers = (c.blockers || []).filter((b: any) =>
    b.applies_to?.includes(audience) || b.applies_to?.includes('all')
  )

  const developerTime = audience === 'just_me' ? '15–30 min' : audience === 'team' ? '30–60 min' : '1–2 hours'
  const approvalTime = audience === 'just_me' ? 'None' : audience === 'team' ? 'None to a few hours' : 'Hours to weeks'

  const knownSlugs = ['slack', 'notion', 'github', 'google-drive']

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
          {knownSlugs.map((slug) => {
            const g = guides.find((x) => x.slug === slug)
            const name = g?.app_name || slug
            const isSelected = selectedSlug === slug
            return (
              <button
                key={slug}
                onClick={() => setSelectedSlug(slug)}
                className={`border rounded-lg p-4 text-left ${isSelected ? 'border-emerald-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold">{name[0]}</div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-400">
                    {g ? 'VERIFIED' : 'COMING SOON'}
                  </span>
                </div>
                <div className="font-medium">{name}</div>
                <div className="text-xs text-zinc-500 mt-1">
                  {g ? 'OAuth setup guide' : 'Coming soon'}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {guide && (
        <section className="px-6 pb-16 max-w-5xl mx-auto">
          <div className="text-emerald-400 text-xs tracking-widest mb-4">02 / {guide.app_name.toUpperCase()}</div>
          <h2 className="text-3xl font-bold mb-2">{guide.app_name}</h2>
          <div className="text-zinc-500 text-sm mb-8">{summary?.difficulty || '—'} · Developer time: {developerTime} · Approval: {approvalTime}</div>

          <div className="mb-10">
            <div className="text-xs text-zinc-500 mb-2">CORE DATA</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-zinc-500">OAuth:</span> {c.core_data?.oauth_supported || '—'}</div>
              <div><span className="text-zinc-500">Developer page:</span> {c.core_data?.developer_page || '—'}</div>
              <div><span className="text-zinc-500">Keys:</span> {c.core_data?.keys || '—'}</div>
              <div><span className="text-zinc-500">Redirect rules:</span> {c.core_data?.redirect_rules || '—'}</div>
              <div className="md:col-span-2"><span className="text-zinc-500">Scopes:</span> {c.core_data?.scopes || '—'}</div>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-xs text-zinc-500 mb-2">STEPS</div>
            <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-300">
              {steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ol>
          </div>

          <div className="mb-10">
            <div className="text-xs text-zinc-500 mb-2">BLOCKERS</div>
            <div className="space-y-2">
              {blockers.map((b: any, i: number) => (
                <div key={i} className="border border-zinc-800 rounded p-3 text-sm">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-zinc-400">{b.meaning}</div>
                  <div className="text-xs text-zinc-500 mt-1">{b.evidence}</div>
                </div>
              ))}
              {blockers.length === 0 && <div className="text-zinc-500 text-sm">No blockers listed for this audience.</div>}
            </div>
          </div>

          <div className="mb-10 overflow-x-auto">
            <div className="text-xs text-zinc-500 mb-2">AGENT VS HUMAN</div>
            <table className="w-full border border-zinc-800 text-sm">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="p-3 text-left">Setup level</th>
                  <th className="p-3 text-left bg-blue-950/40">What the agent can do</th>
                  <th className="p-3 text-left bg-amber-950/40">What you must do</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-zinc-800">
                  <td className="p-3 font-medium">App provisioning</td>
                  <td className="p-3 text-zinc-300">Parse docs. Suggest scopes. Build authorize URL.</td>
                  <td className="p-3 text-zinc-300">Log in. Create the app. Copy Client ID and Secret. Save Redirect URL.</td>
                </tr>
                <tr className="border-t border-zinc-800">
                  <td className="p-3 font-medium">Single workspace<br />(Just me)</td>
                  <td className="p-3 text-zinc-300">Generate token exchange requests. Make API calls with the token.</td>
                  <td className="p-3 text-zinc-300">Complete the install or consent step. Approve access.</td>
                </tr>
                <tr className="border-t border-zinc-800">
                  <td className="p-3 font-medium">Multi-workspace<br />(Team / Public)</td>
                  <td className="p-3 text-zinc-300">Implement callback route handlers. Enforce state token validation. Store tokens.</td>
                  <td className="p-3 text-zinc-300">Turn on distribution or public access. Provision HTTPS. Submit for review if required.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-sm text-zinc-500 border-t border-zinc-800 pt-4 space-y-1">
            <div className="font-medium text-zinc-400 mb-2">Sources</div>
            {(c.sources || []).map((s: any, i: number) => (
              <div key={i}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  {s.label}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 pb-16 max-w-5xl mx-auto border-t border-zinc-800 pt-10">
        <div className="text-emerald-400 text-xs tracking-widest mb-4">03 / GENERATE</div>
        <h2 className="text-2xl font-semibold mb-4">Generate a guide for any app</h2>
        <GenerateForm />
      </section>
    </div>
  )
}

function GenerateForm() {
  const [app, setApp] = useState('')
  const [guide, setGuide] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (!app.trim()) return
    setLoading(true)
    setGuide('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app }),
      })
      const data = await res.json()
      setGuide(data.guide || data.error || 'No response')
    } catch {
      setGuide('Failed to generate guide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="App name or URL (e.g. Slack, Figma, https://...)"
          value={app}
          onChange={(e) => setApp(e.target.value)}
          className="flex-1 border border-zinc-700 bg-zinc-900 text-zinc-100 p-2 rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate guide'}
        </button>
      </div>
      {guide && (
        <div className="border border-zinc-700 rounded p-4 bg-zinc-900 whitespace-pre-wrap text-sm">
          {guide}
        </div>
      )}
    </div>
  )
}