import { useEffect, useMemo, useState } from 'react'
import { ReactedVideo } from '../Score'
import useSupabase from '../../lib/useSupabase'
import { emoji } from '../../lib/utils'
import tyl from './index.module.css'
import { useFeedbacksIn, useRubrics, useWeights } from './queries'

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
    video?.reactions.forEach(({ feedback_id }) => {
      counts[feedback_id] ??= 0
      counts[feedback_id]++
    })
    return counts
  }, [video?.reactions])
  const [rubric, setRubric] = useState<Maybe<Rubric>>()
  const [weights, setWeights] = (
    useState<Record<string, number | string>>({})
  )
  const [rubricHold, setRubricHold] = (
    useState<Maybe<string>>()
  )
  const { supabase } = useSupabase()

  const { data: feedbacks } = useFeedbacksIn(
    supabase, Object.keys(counts),
  )
  const { data: rubrics } = useRubrics(
    supabase, video?.feedback_group_id,
  )
  const { data: defaultWeights } = useWeights(
    supabase, video?.feedback_group_id,
  )
  useEffect(() => {
    if(defaultWeights) setWeights(defaultWeights)
  }, [defaultWeights])

  return (
    <section id={tyl.reactions}>
      <h2>Weighted Reactions</h2>
      <form
        className={tyl['use-rubric']}
        onSubmit={() => {
          setRubric(rubrics?.find((
            { id }: { id: string }
          ) => (
            id === rubricHold
          )))
        }}
      >
        <input
          id="rubric"
          onChange={({ target: { value } }) => (
            setRubricHold(value)
          )}
          value={rubricHold ?? ''}
          list="rubrics"
        />
        <datalist id="rubrics">
          <option value="">Choose a Rubric…</option>
          {rubrics?.map(
            ({ id, name }: { id: string, name: string }) => (
              <option key={id} value={id}>{name}</option>
            )
          )}
        </datalist>
        <nav>
          {rubrics && rubrics?.length > 0 && (
            <button
            >⤟💾 Load a Rubric</button>
          )}
          <button
            type="button"
            onClick={async () => {
              if(video) {
                const { data: newRubric } = (
                  await supabase
                  .from('rubrics')
                  .insert({
                    feedback_group_id: (
                      video.feedback_group_id
                    ),
                    name: rubric,
                    default_weight: 1,
                  })
                  .single() ?? {}
                )
                setRubric(newRubric)
              }
            }}
          >⤟🗃 Add a Rubric</button>
          {rubric && (
            <button
              type="button"
              onClick={() => {
                setWeights({})
                setRubric(null)
              }}
            >⤟🖥 Update a Rubric</button>
          )}
        </nav>
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