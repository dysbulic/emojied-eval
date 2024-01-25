import React from 'react'

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
