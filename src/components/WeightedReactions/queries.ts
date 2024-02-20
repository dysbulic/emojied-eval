import { useQuery } from '@tanstack/react-query'
import { SupabaseClient } from '@supabase/supabase-js'

type Maybe<T> = T | null | undefined

export const useFeedbacksIn = (
  supabase: SupabaseClient, ids: Array<string>
) => {
  return useQuery({
    queryKey: ['feedbacks', ids, supabase],
    queryFn: async () => {
      const { data, error } = (
        await supabase.from('feedbacks')
        .select()
        .in('id', ids as Array<string>)
      )
      if(error) throw error
      return Object.fromEntries(
        data.map(({ id, image }) => [id, image])
      )
    },
    enabled: !!supabase,
  })
}

export const useRubrics = (
  supabase: SupabaseClient, feedback_group_id?: Maybe<string>
) => {
  useQuery({
    queryKey: [
      'rubrics', feedback_group_id, supabase
    ],
    queryFn: async () => {
      let query = (
        supabase.from('rubrics')
        .select('id, name, default_weight')
      )
      if(feedback_group_id) {
        query = (
          query
          .eq('feedback_group_id', feedback_group_id)
        )
      }
      const { data, error } = await query
      if(error) throw error
      return data
    },
    enabled: !!supabase,
  })
}

export const useWeights = (
  supabase: SupabaseClient, rubric_id?: Maybe<string>
) => useQuery({
  queryKey: [
    'rubrics', rubric?.id, { supabase }
  ],
  queryFn: async () => {
    if(!supabase) throw new Error('`supabase` not available.')
    let query = (
      supabase.from('feedback_weights')
      .select(`
        feedback_id, weight
      `)
    )
    if(rubric_id) {
      query = (
        query
        .eq('rubric_id', rubric_id)
      )
    }
    const { data, error } = await query
    if(error) throw error
    return Object.fromEntries(
      data.map(({ id, weight }) => [id, weight])
    )
  },
  enabled: !!supabase,
})
