import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from "react-router-dom"
import useSupabase from "../../lib/useSupabase"
import WeightedReactions from "../WeightedReactions"
import Header from '../Header'

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
          reactions (feedback_id)
        `)
        .eq('id', videoId)
        .single()
      )
      return data
    },
  })

  return (
    (loading ? <p>Loading…</p> : (
      <article>
        <Header>
          <h1>Scoring: <q><Link to={`/eval/${videoId}`}>
            {video.title}
          </Link></q></h1>
        </Header>
        <WeightedReactions video={video as ReactedVideo}/>
      </article>
    ))
  )
}

export default Score