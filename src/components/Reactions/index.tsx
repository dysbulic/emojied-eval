import { ReactNode, useEffect, useRef, useState } from "react"
import ReactionSelector, { type Feedback } from "../ReactionSelector"
import { image } from "../../lib/utils"
import KeyMap from "../KeyMap"
import tyl from './index.module.css'
import { Point } from "../Reactor"

export const Reactions = () => {
  const dialog = useRef<HTMLDialogElement>(null)
  const [output, setOutput] = useState<Array<ReactNode>>([])
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState<Point>()
  const onReactionSelect = (reaction: Feedback) => {
    const Image = image(
      reaction.image,
      {
        key: `${Date.now()}`,
        style: {
          position: 'absolute',
          left: `${position?.x}%`,
          top: `${position?.y}%`,
          translate: '-50% -50%',
        }
      }
    )
    setOutput((out) => [...out, Image])
  }
  const onKeySelect = (pos: Point) => {
    setActive(false)
    setPosition(pos)
    if(!dialog.current?.open) {
      dialog.current?.showModal()
    }
  }
  useEffect(() => {
    const listener = () => setActive(true)
    document.addEventListener('keyup', listener)
    return () => {
      document.removeEventListener('keyup', listener)
    }
  }, [])
  return (
    <article id={tyl.reactions}>
      <KeyMap
        onSelect={onKeySelect}
        {...{ active }}
      />
      <ReactionSelector
        ref={dialog}
        onSelect={onReactionSelect}
      />
      <section className={tyl.output}>
        {output.map((Img) => Img)}
      </section>
    </article>
  )
}

export default Reactions