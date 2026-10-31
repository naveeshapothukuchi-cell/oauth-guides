'use client'

import { useState } from 'react'

export default function Home() {
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
    } catch (err) {
      setGuide('Failed to generate guide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OAuth Setup Guides</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="App name or URL (e.g. Slack, Figma, https://...)"
          value={app}
          onChange={(e) => setApp(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate guide'}
        </button>
      </div>

      {guide && (
        <div className="border rounded p-4 bg-gray-50 whitespace-pre-wrap">
          {guide}
        </div>
      )}
    </div>
  )
}