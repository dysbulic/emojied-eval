import { useCallback, useRef, useState } from 'react'
import { useSupabase } from '../../lib/useSupabase'
import Header from '../Header'
import VideoDialog from '../VideoDialog'
import { Link } from 'react-router-dom'
import { useVideos } from './queries'
import tyl from './index.module.css'
import formtyl from '../../styles/form.module.css'

export type FeedbackGroup = {
  id: string
}
export type Video = {
  id?: string
  url: string
  title: string
  description: string
  feedback_groups?: Array<FeedbackGroup>
  duration?: Maybe<string>
}
type Maybe<T> = T | null | undefined

export const Videos = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { supabase, error: supaError } = useSupabase()
  const {
    isLoading: loading, error: queryError, data: videos, refetch
  } = useVideos(supabase)
  const [video, setVideo] = useState(null)

  const addClick = async () => {
    dialogRef.current?.showModal()
  }
  const onClose = useCallback(() => {
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

  return (
    <article id={tyl.outer}>
      <Header>
        <h1>Videos</h1>
        <nav className={formtyl.buttons}>
          <button
            onClick={addClick}
            className={`${formtyl.add} square`}
          >➕</button>
        </nav>
      </Header>
      <VideoDialog
        {...{ video, onClose }}
        ref={dialogRef}
      />
      <main className={tyl.olTable}>
        {(() => {
          if(loading) return <p>Loading…</p>
          if(videos && videos.length === 0) {
            return (
              <section className={tyl.none}>
                <p>No videos found.</p>
                <button onClick={addClick}>Create One</button>
              </section>
            )
          }
          return (
            <ol>
              {videos?.map((vid) => (
                <li key={vid.id}>
                  <h2><Link to={`/eval/${vid.id}`}>
                    {vid.title}
                  </Link></h2>
                  <div>{vid.description}</div>
                  <nav className={`${formtyl.options} ${formtyl.buttons}`}>
                    <button
                      className={formtyl.edit}
                      onClick={() => edit(vid.id)}
                    >🖉</button>
                    <button
                      className={formtyl.delete}
                      onClick={() => remove(vid.id)}
                    >➖</button>
                    <Link
                      to={`/score/${vid.id}`}
                      className={`${formtyl.score} square`}
                    >🎼</Link>
                  </nav>
                </li>
              ))}
            </ol>
          )
        })()}
      </main>
    </article>
  )
}

export default Videos