import { useSupabase } from '../../lib/useSupabase'
import { useQuery } from '@tanstack/react-query'
import Header from '../Header/index';

export const Videos = () => {
  const { supabase, error: supaError } = useSupabase()
  const {
    isLoading: loading, error: queryError, data: videos,
  } = useQuery({
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

  if(supaError) throw supaError
  if(queryError) throw queryError

  if(loading) return <h1>Loading…</h1>

  return (
    <article id={'t'}>
      <Header/>
      <main>
        <h1>Videos</h1>
        <ol>
          {videos?.map((vid) => (
            <li key={vid.id}>
              <h2><a href={vid.url}>
                {vid.title}
              </a></h2>
              <div>{vid.description}</div>
            </li>
          ))}
        </ol>
      </main>
    </article>
  )
}

export default Videos