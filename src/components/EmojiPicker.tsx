
import React, { useEffect } from 'react'
import Picker from '@emoji-mart/react'

type PickerProps = {
  onEmojiSelect: (emoji: { native: string }, evt: PointerEvent) => void,
  onClose?: () => void,
  visible: boolean,
  center?: { x: number, y: number },
}

export const EmojiPicker = React.forwardRef<HTMLElement, PickerProps>(
  (
    {
      onEmojiSelect,
      onClose,
      visible,
      center,
    },
    holder,
  ) => {
    const onClickOutside = () => {
      onClose?.()
    }

    useEffect(() => {
      if(holder == null) return
      if(holder instanceof Function) {
        throw new Error('`ref` must be a `useRef`, not a function.')
      }
      if(!holder.current) throw new Error('Holder not set.')
      const pick = (
        holder?.current?.querySelector('em-emoji-picker') as HTMLElement
      )
      if(!pick) throw new Error('Picker not found.')

      const max = {
        x: document.documentElement.clientWidth,
        y: document.documentElement.clientHeight,
      }
      if(center) {
        const bbox = {
          w: pick.clientWidth, h: pick.clientHeight,
        }
        pick.style.left = (
          `${Math.min(max.x - bbox.w, Math.max(0, center.x - bbox.w / 2))}px`
        )
        pick.style.top = (
          `${Math.min(max.y - bbox.h, Math.max(0, center.y - bbox.h / 2))}px`
        )
      }
    }, [holder, center])

    return (
      <section
        ref={holder}
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        <Picker
          autoFocus
          {...{
            onEmojiSelect,
            onClickOutside,
          }}
        />
      </section>
    )
  }
)

export default EmojiPicker