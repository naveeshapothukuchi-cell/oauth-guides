import { Suspense } from 'react'
import { GuideView } from '@/components/guide-view'
import { getSlackGuides } from '@/lib/guides'

async function Guides() {
  const guides = await getSlackGuides()
  return <GuideView guides={guides} />
}

export default function Home() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">OAuth Setup Guides</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Guides />
      </Suspense>
    </main>
  )
}
