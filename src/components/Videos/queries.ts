import { useQuery } from '@tanstack/react-query'
import { type SupabaseClient } from "@supabase/supabase-js"
import { Maybe } from '../FeedbackBulkAddDialog'

export const useVideos = (supabase?: Maybe<SupabaseClient>) => {
  return (
    useQuery({
      queryKey: ['Videos', supabase],
      enabled: !!supabase,
      queryFn: async () => {
        const { data, error } = (
          await supabase?.from('videos').select('*, feedback_groups (*)')
        ) ?? {}
        if(error) throw error 
        return data
      }
    })
  )
}