import React, { Attributes, HTMLAttributes } from 'react'

export const capitalize = (str: string) => (
  str.replace(
    /(?<!\p{L})\p{L}(?=\p{L}{2})/gu,
    (ltr: string) => ltr.toUpperCase(),
  )
)

export const emoji = (
  str: string,
  props?: Attributes & HTMLAttributes<Element>,
) => {
  props ??= {}
  props.className = [props.className, 'emoji'].join(' ')
  if(/^(https?|ipfs):\/\//.test(str)) {
    return <img src={str} {...props}/>
  }
  return <span {...props}>{str}</span>
}

// Replaced by Rxjs, but I'd still like to know how to type it.
//
// export const groupBy = (
//   <U, K extends keyof U>(
//     xs: Array<U>, key: K
//   ) => {
//     if(!Array.isArray(xs)) {
//       throw new Error('Argument is not an array.')
//     }
//     xs.reduce((rv: Record<U[K], Array<U>>, x: U) => {
//       (rv[x[key]] ??= []).push(x)
//       return rv
//     }, {})
//   }
// )

export const useAnimationFrame = (
  callback: (Δt: number) => void,
  cleanup?: () => void
) => {
  const requestRef = React.useRef<number>()
  const previousTimeRef = React.useRef<number>()

  const animate = React.useCallback((time: number) => {
    if(previousTimeRef.current) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [callback])

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if(requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      cleanup?.()
    }
  }, [animate, cleanup]) // Make sure the effect runs only once
}

export const here = (any: unknown) => !!any

export const timeToSeconds = (time: string) => {
  const [hours, minutes, seconds] = (
    time.split(':').map(Number)
  )
  return (((hours * 60) + minutes) * 60) + seconds
}
