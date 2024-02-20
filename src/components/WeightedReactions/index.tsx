import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ReactedVideo } from '../Score'
import useSupabase from '../../lib/useSupabase'
import { emoji } from '../../lib/utils'
import tyl from './index.module.css'
import { useFeedbacksIn, useRubrics } from './queries'

type Maybe<T> = T | null | undefined
export type Rubric = {
  id: string
  name: string
  default_weight: number
}

export const WeightedReactions = (
  { video }: { video: ReactedVideo }
) => {
  const counts = useMemo(() => {
    const counts: Record<string, number> = {}
    video.reactions.forEach(({ feedback_id }) => {
      counts[feedback_id] ??= 0
      counts[feedback_id]++
    })
    return counts
  }, [video.reactions])
  const [rubric, setRubric] = useState<Maybe<Rubric>>()
  const [rubricHold, setRubricHold] = (
    useState<Maybe<string>>()
  )
  const { supabase } = useSupabase()

  const { data: feedbacks } = useFeedbacksIn(
    supabase, Object.keys(counts),
  )
  const { data: rubrics } = useRubrics(
    supabase, video.feedback_group_id,
  )
  const { data: weights } = useQuery({
    queryKey: [
      'rubrics', rubric?.id, { supabase }
    ],
    queryFn: async () => {
      if(!supabase) throw new Error('`supabase` not available.')
      let query = (
        supabase.from('feedback_weights')
        .select(`
          id, weight
        `)
        .eq('rubric_id', rubric?.id)
      )
      if(video.feedback_group_id) {
        query = (
          query
          .eq('feedback_group_id', video.feedback_group_id)
        )
      }
      const { data, error } = await query
      console.debug({ data })
      if(error) throw error
      return Object.fromEntries(
        data.map(({ id, weight }) => [id, weight])
      )
    },
    enabled: !!supabase,
  })

  return (
    <section>
      <h2>Weighted Reactions</h2>
      <form onSubmit={({ currentTarget: { elements } }) => {
        setRubric(rubrics?.find(({ id }) => id === rubricHold))
      }}>
        <select
          id="rubric"
          onChange={({ target: { value } }) => (
            setRubricHold(value)
          )}
          value={rubricHold ?? ''}
        >
          <option value="">Choose a Rubric…</option>
          {rubrics?.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <button>Load</button>
      </form>
      <ul className={tyl.listGrid}>
        {Object.entries(counts).map(([id, count]) => {
          const weight = weights?.[id] ?? rubric?.default_weight ?? 0

          return (
            <li key={id}>
              {emoji(feedbacks?.[id])}
              <input
                id={`count-${id}`}
                type="number"
                value={count}
                readOnly
              />
              <input
                id={`weight-${id}`}
                type="number"
                value={weight}
                readOnly
              />
              <output>{count * weight}</output>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default WeightedReactions