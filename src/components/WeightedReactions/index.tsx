import { useEffect, useMemo, useState } from 'react'
import { ReactedVideo } from '../Score'
import useSupabase from '../../lib/useSupabase'
import { emoji } from '../../lib/utils'
import { useFeedbacksIn } from './queries'
import tyl from './index.module.css'

type Maybe<T> = T | null | undefined
export type Rubric = {
  id: string
  name: string
  default_weight: number
}

export const WeightedReactions = (
  { video, rubric, weights: defaultWeights }:
  {
    video: ReactedVideo
    rubric: Maybe<Rubric>
    weights: Maybe<Record<string, number>>
  }
) => {
  const counts = useMemo(() => {
    const counts: Record<string, number> = {}
    video?.reactions.forEach(({ feedback_id }) => {
      counts[feedback_id] ??= 0
      counts[feedback_id]++
    })
    return counts
  }, [video?.reactions])
  const [weights, setWeights] = (
    useState<Record<string, number | string>>({})
  )
  const { supabase } = useSupabase()
  const { data: feedbacks } = useFeedbacksIn(
    supabase, Object.keys(counts),
  )
  useEffect(() => {
    if(defaultWeights) setWeights(defaultWeights)
  }, [defaultWeights])

  return (
    <section id={tyl.reactions}>
      <h2>Weighted Reactions</h2>
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
                onChange={({ target: { value } }) => {
                  setWeights((w) => (
                    { ...w, [id]: value }
                  ))
                }}
              />
              <output>
                {(count * Number(weight)).toLocaleString()}
              </output>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default WeightedReactions