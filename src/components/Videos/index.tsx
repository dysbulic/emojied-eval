import { useSupabase } from '../../lib/useSupabase'
import { useQuery } from '@tanstack/react-query'

export const Videos = () => {
  const { supabase, hasJWT, error: supaError } = useSupabase()
  const { isLoading, error: queryError, data } = useQuery({
    queryKey: ['Videos', { supabase }],
    enabled: !!supabase,
    queryFn: async () => {
      const { data, error } = (
        await supabase?.from('videos').select()
      ) ?? {}
      if(error) throw error 
      return data
    }
  })

  if(queryError) throw queryError

  return (
    <article id={}>
      <Header/>
      <main>
        <h1>Videos</h1>
      </main>
    </article>
  )
}

export default Videos