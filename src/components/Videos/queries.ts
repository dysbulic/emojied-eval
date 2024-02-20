import { useQuery } from '@tanstack/react-query'
import { type SupabaseClient } from "@supabase/supabase-js"

export const useVideos = (supabase: SupabaseClient) => {
  return (
    useQuery({
      queryKey: ['Videos', supabase],
      enabled: !!supabase,
      queryFn: async () => {
        const { data, error } = (
          await supabase?.from('videos').select()
        ) ?? {}
        if(error) throw error 
        return data
      }
    })
  )
}