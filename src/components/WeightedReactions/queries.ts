import { useQuery } from '@tanstack/react-query'
import { SupabaseClient } from '@supabase/supabase-js'
import { Rubric } from '.'

type Maybe<T> = T | null | undefined

export const useFeedbacksIn = (
  supabase: SupabaseClient, ids: Array<string>
) => {
  return useQuery({
    enabled: !!supabase,
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
  })
}

export const useRubrics = (
  supabase: SupabaseClient
) => {
 return (
  useQuery({
    enabled: !!supabase,
    queryKey: ['rubrics', supabase],
    queryFn: async () => {
      const { data, error } = (
        await supabase.from('rubrics')
        .select('id, name, default_weight')
      )
      if(error) throw error
      return data
    },
  })
 )
}

export const useWeights = (
  supabase: SupabaseClient,
  rubric?: Maybe<Rubric>,
  feedback_ids?: Array<string>,
) => useQuery({
  enabled: !!supabase,
  queryKey: [
    'rubrics', rubric?.id, feedback_ids, supabase
  ],
  queryFn: async () => {
    if(!supabase) throw new Error('`supabase` not available.')
    if(!rubric) return {}
    let query = (
      supabase.from('feedbacks_weights')
      .select('feedback_id, weight')
      .eq('rubric_id', rubric.id)
    )
    if(feedback_ids && feedback_ids.length > 0) {
      query = query.in('feedback_id', feedback_ids)
    }
    const { data, error } = await query
    if(error) throw error
    return Object.fromEntries(
      data.map(({ feedback_id, weight }) => (
        [feedback_id, weight]
      ))
    )
  },
})
