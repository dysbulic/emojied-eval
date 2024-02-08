import { useParams } from "react-router-dom"
import useSupabase from "../../lib/useSupabase"
import { useQuery } from '@tanstack/react-query'

export const Score = () => {
  const { supabase } = useSupabase()
  const { uuid: videoId } = useParams()
  const { data: video } = useQuery({
    queryKey: [ "score", videoId, ( supabase )],
    queryFn: async () => {
      return await supabase.from('videos')
      .select(`
        id,
        reactions (*)
      `)
      .eq('id', videoId)
    },
    enabled: !!supabase
  })
  console.log({video})
  const score = 0
  return (
    <div>{score}</div>
  )
}

export default Score