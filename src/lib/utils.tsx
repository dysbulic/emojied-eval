import React from 'react'

export const capitalize = (str: string) => (
  str.replace(
    /(?<!\p{L})\p{L}(?=\p{L}{2})/gu,
    (ltr: string) => ltr.toUpperCase(),
  )
)

export const image = (str: string) => {
  if(/^(https?|ipfs):\/\//.test(str)) {
    return <img src={str} className="emoji"/>
  }
  return <span className="emoji">{str}</span>
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
