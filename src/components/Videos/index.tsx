import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../../lib/useSupabase'
import Header from '../Header';
import VideoDialog from '../VideoDialog';
import tyl from './index.module.css'

export type Video = {
  id: string
  url: string
  title: string
  description: string
  feedback_group_id: string
}

export const Videos = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { supabase, error: supaError } = useSupabase()
  const {
    isLoading: loading, error: queryError, data: videos, refetch
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
  const [video, setVideo] = useState(null)

  const addClick = async () => {
    console.debug('Trying to open dialog…')
    dialogRef.current?.showModal()
  }
  const onClose = useCallback(() => {
    console.debug('Closing dialog…')
    setVideo(null)
    refetch()
  }, [refetch])


  const edit = (id: string) => {
    const vid = videos?.find((v) => v.id === id)
    if(!vid) throw new Error(`No video found with id: "${id}".`)
    setVideo(vid)
    addClick()
  }
  const remove = async (id: string) => {
    await supabase?.from('videos').delete().eq('id', id)
    refetch()
  }

  if(supaError) throw supaError
  if(queryError) throw queryError

  if(loading) return <h1>Loading…</h1>

  return (
    <article id={tyl.outer}>
      <VideoDialog
        {...{ video, onClose }}
        ref={dialogRef}
      />
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
              <nav>
                <button onClick={() => edit(vid.id)}>🖉</button>
                <button onClick={() => remove(vid.id)}>➖</button>
              </nav>
            </li>
          ))}
        </ol>
      </main>
    </article>
  )
}

export default Videos