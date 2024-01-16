
import React, { useEffect } from 'react'
import Picker from '@emoji-mart/react'

type PickerProps = {
  onEmojiSelect: (emoji: unknown, evt: unknown) => void,
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
      // onClose?.()
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

      // const sheet = new CSSStyleSheet()
      // sheet.replaceSync('#root { height: max(50vh, 35ch) }')
      // pick.shadowRoot?.adoptedStyleSheets.push(sheet)

      const max = {
        x: document.documentElement.clientWidth,
        y: document.documentElement.clientHeight,
      }
      if(center) {
        const bbox = {
          w: pick.clientWidth, h: pick.clientHeight,
        }
        pick.style.left = `${center.x - bbox.w / 2}px`
        pick.style.top = (
          `${Math.min(max.y - bbox.h, Math.max(0, center.y - bbox.h / 2))}px`
        )
      }
    }, [holder, center])

    console.debug({ visible })

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