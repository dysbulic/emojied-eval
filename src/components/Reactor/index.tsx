import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { useAnimationFrame } from '../../lib/utils'
import { Drifter } from '../../Drifter'
import { KeyMap } from '../KeyMap'
import { useSupabase } from '../../lib/useSupabase'
import { type Reaction } from '../ReactionDialog'
import tyl from './index.module.css'
import ReactionSelector from '../ReactionSelector'
import Logo from '../Logo'

export type DrifterConfig = {
  at?: { x: number, y: number },
  time?: number,
}

export type Point = { x: number, y: number }

export const Reactor = () => {
  const dialog = useRef<HTMLDialogElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const drifters = useRef<Array<Drifter>>([])
  const [newConfig, setNewConfig] = (
    useState<DrifterConfig | null>(null)
  )
  const [wasPlaying, setWasPlaying] = useState<boolean>(true)
  const [center, setCenter] = useState<Point>()
  const [keyMapActive, setKeyMapActive] = (
    useState<boolean>(false)
  )
  const { supabase, error: supaError } = useSupabase()
  if(supaError) console.error({ supaError })
  const { uuid: videoUUID } = useParams()
  const {
    /* isLoading: loading, */ error: queryError, data: videoConfig,
  } = useQuery({
    queryKey: ['Reactor', { uuid: videoUUID, supabase }],
    queryFn: async () => {
      if(!supabase) throw new Error('Supabase not initialized.')
      const { data, error } = (
        await supabase?.from('videos')
        .select('*, feedback_groups (id, title)')
        .eq('id', videoUUID)
        .single()
      ) ?? {}
      if(error) throw error 
      return data
    },
    enabled: !!supabase,
    // suspense: true,
  })
  console.debug({ videoConfig })
  if(queryError) console.error({ queryError })
  const updatePositions = useCallback(
    () => {
      if(video.current) {
        const time = video.current.currentTime * 1000
        drifters.current.forEach((drifter) => drifter.time = time)
      }
    },
    [],
  )
  useAnimationFrame(updatePositions)

  const listener = useCallback((evt: KeyboardEvent) => {
    if(!video.current) throw new Error('<video> ref is not set.')
    switch(evt.key) {
      case 'Escape': {
        document.addEventListener('keyup', listener)
        dialog.current?.close()
        setKeyMapActive(false)
        if(wasPlaying) video.current.play()
        break
      }
      case 'e': {
        setNewConfig({ time: video.current.currentTime * 1000 })
        setKeyMapActive(true)
        break
      }
      case ' ': {
        if(video.current.paused) {
          video.current.play()
        } else {
          video.current.pause()
        }
        break
      }
      case 'ArrowLeft':
      case 'ArrowRight': {
        let multiplier = 10
        if(evt.shiftKey) multiplier *= 2
        if(evt.ctrlKey) multiplier /= 2
        if(evt.key === 'ArrowLeft') multiplier *= -1
        video.current.currentTime += video.current.duration / multiplier
        break
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        let delta = 1
        if(evt.shiftKey) delta *= 2
        if(evt.ctrlKey) delta /= 2
        if(evt.key === 'ArrowDown') delta *= -1
        video.current.currentTime += delta
        break
      }
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9': {
        // I can't disable ESLint complaining about fallthrough
        const rate = (() => {
          switch(evt.key) {
            case '0': return 0.25
            case '1': return 0.5
            case '2': return 1
            case '3': return 1.25
            case '4': return 1.5
            case '5': return 2
            case '6': return 4
            case '7': return 8
            case '8': return 10
            case '9': return 20
            default: return 1
          }
        })()
        video.current.playbackRate = rate
        toast(`Playback ⨯${rate}`)
        break
      }
      default: { null }
    }
  }, [wasPlaying])

  const onClick = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if(!video.current) throw new Error('<video> not found.')
      const click = { x: evt.clientX, y: evt.clientY }
      const at = {
        x: click.x / video.current.clientWidth * 100,
        y: click.y / video.current.clientHeight * 100,
      }
      setCenter(at)
      setNewConfig({ at, time: video.current.currentTime * 1000 })
      setWasPlaying(!video.current.paused)
      video.current.pause()
      document.removeEventListener('keyup', listener)
      dialog.current?.showModal()
    },
    [listener],
  )

  const onClose = useCallback(() => {
    document.addEventListener('keyup', listener)
    dialog.current?.close()
  }, [listener])

  const onReactionSelect = async (
    reaction: Reaction, evt: MouseEvent<HTMLButtonElement>
  ) => {
    evt.stopPropagation()

    if(!newConfig) {
      throw new Error('Emoji selected without initial config.')
    }
    if(!newConfig.at || !newConfig.time) {
      throw new Error('Emoji selected without complete config.')
    }
    if(!video.current) throw new Error('<video> ref is not set.')
    if(!overlay.current) throw new Error('Overlay ref is not set.')

    const start = newConfig.time
    const end = newConfig.time + 4 * 1000
    const initial = newConfig.at
    const content = reaction.image

    if(!content) throw new Error('Reaction has no emoji.')

    drifters.current.push(new Drifter({
      start, end, initial, content,
      parent: overlay.current,
      className: tyl.drifting ,
    }))

    setNewConfig(null)

    if(wasPlaying) video.current.play()

    if(supabase) {
      const { data } = (
        await supabase.from('feedbacks')
        .select()
        .eq('image', content)
        .single()
      )
      let feedbackId = data?.id
      if(!feedbackId){
        const { data, error: feedbackError } = (
          await supabase.from('feedbacks').insert(
            { image: content },
          )
          .select()
          .single()
        )
        feedbackId = data.id

        if(feedbackError) throw feedbackError
      }
      await supabase?.from('reactions').insert({
        start_time: new Date(start).toISOString().split('T').at(-1),
        end_time: new Date(end).toISOString().split('T').at(-1),
        initial_x: Math.round(initial.x),
        initial_y: Math.round(initial.y),
        video_id: videoUUID, feedback_id: feedbackId,
      })
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', listener)
    return () => {
      document.removeEventListener('keyup', listener)
    }
  }, [listener])

  const onKeySelect = (at: Point) => {
    if(!video.current) throw new Error('<video> ref is not set.')
    setCenter(at)
    setKeyMapActive(false)
    setNewConfig({ ...newConfig, at })
    setWasPlaying(!video.current.paused)
    video.current.pause()
    dialog.current?.showModal()
  }

  return (
    <article id={tyl.reactor}>
      <Toaster/>
      <section className={tyl.video}>
        {!videoConfig ? (
          <h3>Loading…</h3>
        ) : (
          <video controls muted autoPlay ref={video}> 
            <source src={videoConfig.url}/>
            <track default src="animated.vtt" kind="subtitles" label="Animated"/>
          </video>
        )}
        <div id={tyl.overlay} ref={overlay} {...{ onClick }}></div>
        <KeyMap active={keyMapActive} onSelect={onKeySelect}/>
      </section>
      <Link to="/" className={tyl.home}>
        <Logo/>
      </Link>
      <ReactionSelector
        feedbackGroupIds={videoConfig?.feedback_groups?.map(
          ({ id }: { id: string }) => id
        )}
        ref={dialog}
        onSelect={onReactionSelect}
        {...{
          onClose,
          center,
        }}
      />
    </article>
  )
}

export default Reactor