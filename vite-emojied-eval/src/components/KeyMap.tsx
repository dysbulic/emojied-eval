import { useEffect } from "react"
import type { Point } from "./Reactor"

export const defaultKeys = [
  '`1234567890-='.split(''),
  'qwertyuiop[]\\'.split(''),
  'asdfghjkl;\''.split(''),
  'zxcvbnm,./'.split(''),
]

export const KeyMap = (
  { keys = defaultKeys, active = true, onSelect }:
  {
    keys?: Array<Array<string>>
    active: boolean
    onSelect?: (pos: Point) => void
  }
) => {
  const bbox = { w: 300, h: 100 }

  useEffect(() => {
    const listener = (evt: KeyboardEvent) => {
      if(onSelect && active) {
        let pos
        keys.forEach((row, rowIdx) => {
          const idx = row.indexOf(evt.key)
          if(idx >= 0) {
            pos = {
              x: (idx / row.length + 1 / row.length / 2) * 100,
              y: (1 - (rowIdx + 1) / keys.length) * 100,
            }
          }
        })
        if(pos) onSelect(pos)
      }
    }
    document.addEventListener('keypress', listener)

    return () => {
      document.removeEventListener('keypress', listener)
    }
  }, [active, keys, onSelect])

  console.debug({ active })

  if(!active) return null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="onscreen-keymap"
      preserveAspectRatio="none"
      viewBox={`0 0 ${bbox.w} ${bbox.h}`}
    >
      {keys.map((row, rowIdx) => {
        return row.map((key, keyIdx) => (
          <g key={key}>
            <rect
              x={keyIdx * bbox.w / row.length}
              y={rowIdx * bbox.h / keys.length}
              width={bbox.w / row.length}
              height={bbox.h / keys.length}
              fillOpacity={0.25}
              stroke="white"
            />
            <text
              x={(keyIdx + 0.5) * bbox.w / row.length}
              y={(rowIdx + 0.6) * bbox.h / keys.length}
              fill="white"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {key}
            </text>
          </g>
        ))
      })}
    </svg>
  )
}

export default KeyMap