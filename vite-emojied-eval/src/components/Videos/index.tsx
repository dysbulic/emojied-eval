import { useSupabase } from '../../lib/useSupabase'
import { useQuery } from '@tanstack/react-query'

export const Videos = () => {
  const { supabase, hasJWT, error: supaError } = useSupabase()
  const { isLoading, error: queryError, data } = useQuery({
    queryKey: ['Videos', {supabase}],
    enabled: !!supabase,
    queryFn: async () => {
      console.debug ({ supabase })
      const { data, error } = (
        await supabase
        .from('videos')
        .select()
      )
      console.debug({ data, error })
      if(error) throw error 
      return data
    }
  })
  if(queryError) throw queryError
  console.debug({ data })

  let content = null

  return null
  
}

export default Videos