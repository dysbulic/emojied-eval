import { Drifter } from './Drifter';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AppContextProvider, useAppContext } from "./context/appContext";
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame } from './utils'
import EmojiPicker from './components/EmojiPicker';
import "./App.css";

type DrifterConfig = {
  at: { x: number, y: number },
  time: number,
}

type Point = { x: number, y: number }

function App() {
  const overlay = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const drifters = useRef<Array<Drifter>>([])
  const picker = useRef<HTMLElement>(null)
  const [newConfig, setNewConfig] = (
    useState<DrifterConfig | null>(null)
  )
  const [wasPlaying, setWasPlaying] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [center, setCenter] = useState<Point>()

  const updatePositions = useCallback(
    () => {
      if(!video.current) throw new Error('<video> not found.')
      const time = video.current.currentTime * 1000
      drifters.current.forEach((drifter) => drifter.time = time)
    },
    [],
  )
  useAnimationFrame(updatePositions)

  console.debug({ o: picker })

  const onClick = useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if(!video.current) throw new Error('<video> not found.')
      const at = { x: evt.clientX, y: evt.clientY }
      setCenter(at)
      console.debug('Setting `visible` to `true`.')
      setVisible(true)
      setNewConfig({ at, time: video.current.currentTime * 1000 })
      setWasPlaying(!video.current.paused)
      video.current.pause()
    },
    []
  )

  const onClose = () => {
    if(!picker.current) {
      throw new Error('Holder doesn’t exist.')
    }

    setVisible(false)
    console.debug('Adding Listener')
  }

  const onEmojiSelect = (emoji, evt) => {
    evt.cancelBubble = true

    if(!newConfig) {
      throw new Error('Emoji selected without initial config.')
    }

    Object.entries({ overlay, picker, video })
    .forEach(([name, ref]) => {
      if(!ref.current) {
        throw new Error(`"${name}" doesn’t exist.`)
      }
    })

    console.debug({ evt, emoji })

    const drifter = new Drifter({
      start: newConfig.time,
      end: newConfig.time + 4 * 1000,
      initial: {
        x: newConfig.at.x / video.current!.clientWidth * 100,
        y: 100 - newConfig.at.y / video.current!.clientHeight * 100,
      },
      content: emoji.native,
      parent: overlay.current!,
    })
    drifters.current.push(drifter)

    console.debug({ new: drifter.toString() })

    setVisible(false)

    console.debug('Adding Listener')
    if(wasPlaying) video.current!.play()
  }

  console.debug({ iv: visible })

  return (
    <>
      <video controls muted autoPlay ref={video}>
        <source src="Big Buck Bunny trailer.webm" type="video/webm"/>
        <track default src="animated.vtt" kind="subtitles" label="Animated"/>
      </video>
      <div id="overlay" ref={overlay} {...{ onClick }}></div>
      <EmojiPicker
        ref={picker}
        visible={visible}
        {...{
          onEmojiSelect,
          onClose,
          // visible,
          center,
        }}
      />
    </>
  )
}

export default App