import { useQuery } from '@tanstack/react-query'
import { type SupabaseClient } from '@supabase/supabase-js'

type Maybe<T> = T | null | undefined

export const useFeedbacks = (supabase: Maybe<SupabaseClient>) => (
  useQuery({
    enabled: !!supabase,
    queryKey: ['FeedbackGroups', 'feedbacks', supabase],
    queryFn: async () => {
      const { data } = (
        await supabase?.from('feedbacks').select()
      ) ?? {}
      return data
    },
  })
)

export const useGroups = (supabase: Maybe<SupabaseClient>) => (
  useQuery({
    enabled: !!supabase,
    queryKey: ['FeedbackGroups', 'groups', supabase],
    queryFn: async () => {
      const { data } = (
        await supabase?.from('feedback_groups')
        .select('*, feedbacks_groups (*)')
        .order('title')
      ) ?? {}
      return data
    },
  })
)

export const useSelected = (
  supabase: Maybe<SupabaseClient>, uuid: Maybe<string>,
) => (
  useQuery({
    enabled: !!supabase && uuid != null,
    queryKey: ['FeedbackGroups', 'selected', uuid, supabase],
    queryFn: async () => {
      if(!uuid) return new Set<string>()
      const { data } = (
        await supabase?.from('feedbacks_groups')
        .select(`
          feedbacks (id)
        `)
        .eq('group_id', uuid)
      ) ?? {}
      return new Set(data?.map(
        ({ feedbacks }) => Array.isArray(feedbacks) ? (
          feedbacks.map(({ id }) => id)
        ) : (
          (feedbacks as { id: string }).id
        )
      ).flat())
    },
    initialData: new Set<string>(),
  })
)
