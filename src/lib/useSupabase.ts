import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { supabase as supaConfig } from '../config.ts'
import { decodeJwt as decodeJWT } from 'jose'
import { useEffect, useState } from 'react'

type Maybe<T> = T | null | undefined
export type ReturnType = {
  supabase?: Maybe<SupabaseClient>
  hasJWT: boolean
  error?: string
}

export const useSupabase = () => {
  const jwt = localStorage.getItem(supaConfig.jwtStorageKey)
  const [error, setError] = useState<Maybe<string>>(null)
  const [supabase, setSupabase] = (
    useState<Maybe<SupabaseClient>>(createClient(
      supaConfig.url,
      supaConfig.anonKey,
      { global: {
        headers: { Authorization: `Bearer ${jwt}` },
      } },
    ))
  )

  useEffect(() => {
    setError(null)
    const build = async () => {
      try {
        if(!jwt) {
          setSupabase(undefined)
        } else {
          const { exp } = await decodeJWT(jwt)
          if(exp != null && exp * 1000 < Date.now()) {
            console.warn(
              `Removing expired (${exp} < ${Date.now()}) JWT: "${jwt}".`
            )
            localStorage.removeItem(supaConfig.jwtStorageKey)
            setSupabase(undefined)
          }
        }
      } catch(err) {
        console.error({ err })
        setError((err as Error).message)
      }
    }
    build()
  }, [jwt])

  const ret: ReturnType = {
    supabase,
    hasJWT: !!jwt,
  }
  if(error) ret.error = error
  return ret
}

export const onlyClient = (supabase: unknown) => {
  if(!supabase) throw new Error('`supabase` not available.')
  if(typeof supabase === 'string') {
    throw new Error('`supabase` is a string.')
  }
  if(Array.isArray(supabase)) {
    throw new Error('`supabase` is an array.')
  }
  return supabase as SupabaseClient
}

export default useSupabase
