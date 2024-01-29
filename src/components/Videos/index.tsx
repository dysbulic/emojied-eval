import { useRef } from 'react';
import { useSupabase } from '../../lib/useSupabase'
import { useQuery } from '@tanstack/react-query'
import Header from '../Header/index';
import VideoForm from '../VideoForm';
import tyl from './index.module.css'

export const Videos = () => {
  const addDialog = useRef<HTMLDialogElement>(null)
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

  const addClick = async () => {
    addDialog.current?.showModal()
  }


  if(supaError) throw supaError
  if(queryError) throw queryError

  if(loading) return <h1>Loading…</h1>

  return (
    <article id={tyl.outer}>
      <dialog ref={addDialog}>
        <VideoForm/>
      </dialog>
      <Header/>
      <header className={tyl.header}>
        <h1>Videos</h1>
        <button onClick={addClick}>➕</button>
      </header>
      <main className={tyl.olTable}>
        <ol>
          {videos?.map((vid) => (
            <li key={vid.id}>
              <h2><a href={`eval/${vid.id}`}>
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