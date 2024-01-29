// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AppContextProvider, useAppContext } from "./context/appContext";
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { useAnimationFrame } from '../utils'
import { Drifter } from '../Drifter'
import { EmojiPicker } from './EmojiPicker'
import { KeyMap } from './KeyMap'
import { useSupabase } from '../lib/useSupabase'

type DrifterConfig = {
  at?: { x: number, y: number },
  time?: number,
}

export type Point = { x: number, y: number }

export const Reactor = () => {
  const overlay = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const drifters = useRef<Array<Drifter>>([])
  const picker = useRef<HTMLElement>(null)
  const [newConfig, setNewConfig] = (
    useState<DrifterConfig | null>(null)
  )
  const [wasPlaying, setWasPlaying] = useState<boolean>(true)
  const [center, setCenter] = useState<Point>()
  const [pickerActive, setPickerActive] = (
    useState<boolean>(false)
  )
  const [keyMapActive, setKeyMapActive] = (
    useState<boolean>(false)
  )
  const { supabase } = useSupabase()
  const { uuid: videoUUID } = useParams()
  const {
    /* isLoading: loading, */ error: queryError, data: videoConfig,
  } = useQuery({
    queryKey: ['Reactor', { supabase }],
    enabled: !!supabase,
    queryFn: async () => {
      const { data, error } = (
        await supabase?.from('videos')
        .select()
        .eq('id', videoUUID)
        .single()
      ) ?? {}
      if(error) throw error 
      return data
    }
  })
  if(queryError) console.error({ queryError })
  const updatePositions = useCallback(
    () => {
      if(!video.current) throw new Error('<video> not found.')
      const time = video.current.currentTime * 1000
      drifters.current.forEach((drifter) => drifter.time = time)
    },
    [],
  )
  useAnimationFrame(updatePositions)

  const onClick = useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if(!video.current) throw new Error('<video> not found.')
      const click = { x: evt.clientX, y: evt.clientY }
      setCenter(click)
      setPickerActive(true)
      const at = {
        x: click.x / video.current.clientWidth * 100,
        y: (1 - click.y / video.current.clientHeight) * 100,
      }
      setNewConfig({ at, time: video.current.currentTime * 1000 })
      setWasPlaying(!video.current.paused)
      video.current.pause()
    },
    [],
  )

  const onClose = () => {
    if(pickerActive) setPickerActive(false)
  }

  const onEmojiSelect = (emoji: { native: string }, evt: PointerEvent) => {
    evt.stopPropagation()

    if(!newConfig) {
      throw new Error('Emoji selected without initial config.')
    }
    if(!newConfig.at || !newConfig.time) {
      throw new Error('Emoji selected without complete config.')
    }
    if(!video.current) throw new Error('<video> ref is not set.')
    if(!overlay.current) throw new Error('Overlay ref is not set.')

    const drifter = new Drifter({
      start: newConfig.time,
      end: newConfig.time + 4 * 1000,
      initial: newConfig.at,
      content: emoji.native,
      parent: overlay.current,
    })
    drifters.current.push(drifter)

    setPickerActive(false)
    setNewConfig(null)

    if(wasPlaying) video.current.play()
  }

  useEffect(() => {
    const listener = (evt: KeyboardEvent) => {
      if(!video.current) throw new Error('<video> ref is not set.')
      switch(evt.key) {
        case 'Escape': {
          setPickerActive(false)
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
          let multiplier = evt.shiftKey ? 10 : 20
          if(evt.key === 'ArrowLeft') multiplier *= -1
          video.current.currentTime += video.current.duration / multiplier
          break
        }
        case 'ArrowUp':
        case 'ArrowDown': {
          let delta = 1
          if(evt.key === 'ArrowDown') delta *= -1
          video.current.currentTime += delta
          break
        }
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          let rate = Number(evt.key)
          if(rate === 0) rate = 0.5
          video.current.playbackRate = rate
          toast(`Playback ⨯${evt.key}`)
          break
        }
        default: {
          console.debug({ key: evt.key })
        }
      }
    }
    document.addEventListener('keyup', listener)

    return () => {
      document.removeEventListener('keyup', listener)
    }
  }, [wasPlaying])

  const onKeySelect = (at: Point) => {
    if(!video.current) throw new Error('<video> ref is not set.')
    const center = {
      x: at.x * video.current.clientWidth / 100,
      y: video.current.clientHeight * (1 - at.y / 100),
    }
    setCenter(center)
    setKeyMapActive(false)
    setPickerActive(true)
    setNewConfig({ ...newConfig, at })
    setWasPlaying(!video.current.paused)
    video.current.pause()
  }

  if(!videoConfig) {
    throw new Promise((resolve) => setTimeout(resolve, 2000)) 
  }

  return (
    <>
      <Toaster/>
      <video controls muted autoPlay ref={video}> 
        <source src={videoConfig.url}/>
        <track default src="animated.vtt" kind="subtitles" label="Animated"/>
      </video>
      <div id="overlay" ref={overlay} {...{ onClick }}></div>
      <KeyMap active={keyMapActive} onSelect={onKeySelect}/>
      <EmojiPicker
        ref={picker}
        visible={pickerActive}
        {...{
          onEmojiSelect,
          onClose,
          center,
        }}
      />
    </>
  )
}

export default Reactor