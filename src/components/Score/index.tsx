import { useQuery } from '@tanstack/react-query'
import { useParams } from "react-router-dom"
import useSupabase from "../../lib/useSupabase"
import WeightedReactions from "../WeightedReactions"

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
    queryKey: ['score', videoId, { supabase }],
    queryFn: async () => {
      if(!supabase) throw new Error('`supabase` not available.')
      const { data } = (
        await supabase.from('reactions')
        .select(`
          *,
          feedbacks(*),
          videos (*)
        `)
        .eq('video_id', videoId)
        .single()
      )
      return data                                                                                        
    },
    enabled: !!supabase
  })
  console.debug({ video })
  return (
    (loading ? <p>Loading…</p> : (
      <article>
        <h1>Scoring: <q>{video.title}</q></h1>
        <WeightedReactions video={video as ReactedVideo}/>
      </article>
    ))
  )
}

export default Score