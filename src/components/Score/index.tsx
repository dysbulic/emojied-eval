import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from "react-router-dom"
import useSupabase from "../../lib/useSupabase"
import WeightedReactions, { Rubric } from "../WeightedReactions"
import Header from '../Header'
import { WeightsChart } from '../WeightsChart'
import { useState } from 'react'
import { useRubrics, useWeights } from '../WeightedReactions/queries'
import tyl from './index.module.css'
import formtyl from '../../styles/form.module.css'

type Maybe<T> = T | null | undefined
export type ReactedVideo = {
  id: string
  title: string
  feedback_group_id: Maybe<string>
  reactions: Array<{
    id: string
    video_id: string
    feedback_id: string
    start_time: string
    end_time: number
  }>
}

export const Score = () => {
  const { supabase } = useSupabase()
  const { uuid: videoId } = useParams()
  const [rubric, setRubric] = useState<Maybe<Rubric>>()
  const { data: video, isLoading: loading } = useQuery({
    enabled: !!supabase,
    queryKey: ['score', videoId, supabase],
    queryFn: async () => {
      if(!supabase) throw new Error('`supabase` not available.')
      const { data } = (
        await supabase.from('videos')
        .select(`
          *,
          feedback_groups (feedbacks (*)),
          reactions (feedback_id, start_time)
        `)
        .order('start_time', { referencedTable: 'reactions' })
        .eq('id', videoId)
        .single()
      )
      return data
    },
  })
  const { data: rubrics } = useRubrics(supabase)
  const { data: weights } = useWeights(
    supabase, rubric,
  )

  return (
    (loading ? <p>Loading…</p> : (
      <article>
        <Header>
          <h1>Scoring: <q><Link to={`/eval/${videoId}`}>
            {video.title}
          </Link></q></h1>
        </Header>
        {!rubrics || rubrics.length === 0 ? (
          <aside className={tyl.noRubrics}>
            <Link
              to="/rubrics"
              className="button"
            >Create a Rubric</Link>
          </aside>
        ) : (
          <form
            className={`${tyl['use-rubric']} ${formtyl.buttons}`}
          >
            <select
              value={rubric?.id}
              onChange={({ target: { value } }) => {
                setRubric(rubrics?.find((
                  { id }: { id: string }
                ) => (
                  id === value
                )))
              }}
            >
              <option value="">Choose a Rubric</option>
              {rubrics?.map(
                ({ id, name }: { id: string, name: string }) => (
                  <option key={id} value={id}>{name}</option>
                )
              )}
            </select>
          </form>
        )}
        <WeightedReactions
          video={video as ReactedVideo}
          {...{ rubric, weights }}
        />
        <WeightsChart
          video={video as ReactedVideo}
          {...{ rubric, weights }}
        />
      </article>
    ))
  )
}

export default Score