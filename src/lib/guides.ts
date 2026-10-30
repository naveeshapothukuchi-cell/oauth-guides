import { createSupabaseClient } from '@/lib/supabase'

export type Audience = 'just_me' | 'team' | 'public'

export type Blocker = {
  name?: string
  meaning?: string
  evidence?: string
  applies_to?: string[]
}

export type GuideContent = {
  summary?: Partial<Record<Audience, { difficulty?: string; review?: string }>>
  core_data?: {
    oauth_supported?: string
    developer_page?: string
    registration_fields?: string
    keys_you_get_back?: string
    redirect_address_rules?: string
    scopes?: string
    token_life_and_renewal?: string
    agent_vs_you?: string
  }
  steps?: string[]
  blockers?: Blocker[]
  tested?: { date?: string; who?: string; what_was_seen?: string }
}

export type Guide = {
  app_name: string
  slug: string
  status: string
  content: GuideContent | null
}

export async function getSlackGuides(): Promise<Guide[]> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('guides')
    .select('app_name, slug, status, content')
    .ilike('slug', '%slack%')

  if (error) {
    throw new Error(`Failed to load guides from Supabase: ${error.message}`)
  }
  return (data ?? []) as Guide[]
}
