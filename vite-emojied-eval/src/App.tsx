import { ChakraProvider, Box, theme } from "@chakra-ui/react";
// import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import "./App.css";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider, useAppContext } from "./context/appContext";
import { useEffect, useRef, useState } from "react";

class Drifter {
  elem
  start
  end
  initial
  height

  constructor(
    { parent, element, start, end, initial, height, content }:
    {
      parent: HTMLElement
      element?: HTMLElement
      start: number
      end: number
      initial: { x: number, y: number }
      height: number
      content: string
    }
  ) {
    element ??= (() => {
      const newElem = document.createElement('span')
      newElem.classList.add('drifting')
      console.debug({ ov: parent })
      parent.appendChild(newElem)
      return newElem
    })()
    this.elem = element
    this.content = content
    this.opacity = '0'

    this.start = start ?? Number(element.dataset.start)
    if(isNaN(this.start)) {
      throw new Error(
        '`.drifting` must have a `data-start` time or '
        + '`Drifting` must have `{start}`.'
      )
    }

    this.end = end ?? Number(element.dataset.end ?? this.start + 2500)

    element.dataset.x ??= String(20 + Math.random() * 60)
    this.initial = {
      x: initial?.x ?? Number(element.dataset.x),
      y: initial?.y ?? Number(element.dataset.y ?? 0),
    }

    this.height = height ?? Number(element.dataset.height ?? 40)
  }

  set left(x: string) {
    this.elem.style.left = x
  }

  set top(y: string) {
    this.elem.style.top = y
  }

  set opacity(o: string) {
    this.elem.style.opacity = o
  }

  set content(content: string) {
    this.elem.textContent = content
  }

  toString() {
    return (
      'Drifter('
      + `${this.start}–${this.end}, `
      + `<${this.initial.x}, ${this.initial.y}>, `
      + `${this.elem.textContent})`
    )
  }
}

function App() {
  const overlay = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const drifters = useRef<Array<Drifter>>([])

  useEffect(() => {
    if(drifters.current.length > 0) return
    if(!overlay.current) return
    drifters.current = [
      new Drifter({
        parent: overlay.current,
        start: 0,
        end: 10 * 1000,
        initial: { x: 20, y: 0 },
        height: 40,
        content: '🏔',
      })
    ]
  }, [])

  const updatePositions = () => {
    if(!video.current) throw new Error('<video> not found.')
    const time = video.current.currentTime * 1000
    console.debug({ dl: drifters.current.length, time })
    drifters.current.forEach((drifter) => {
      console.debug({ d: drifter.toString() })
      if(time >= drifter.start && time <= drifter.end) {
        const progress = (time - drifter.start) / (drifter.end - drifter.start)
        const x = `${drifter.initial.x + Math.cos(6 * Math.PI * progress)}%`
        drifter.left = x
        const y = `${-drifter.initial.y + 100 - (drifter.height * progress)}%`
        drifter.top = y
        drifter.opacity = String(1 - progress)
      } else {
        drifter.opacity = String(0)
      }
    })
    return requestAnimationFrame(updatePositions)
  }
  useEffect(() => {
    const requestId = updatePositions()
    return () => cancelAnimationFrame(requestId)
  }, [])

  return (
    <>
      <video controls muted autoPlay ref={video}>
        <source src="Big Buck Bunny trailer.webm" type="video/webm"/>
        <track default src="animated.vtt" kind="subtitles" label="Animated"/>
      </video>
      <div id="overlay" ref={overlay}></div>
    </>
  )
}

export default App
