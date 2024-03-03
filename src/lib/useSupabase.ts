import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { supabase as supaConfig } from '../config.ts'
import { decodeJwt as decodeJWT } from 'jose'
import { useEffect, useState } from 'react'

type Maybe<T> = T | null
export type ReturnType = {
  supabase: SupabaseClient
  hasJWT: boolean
  error?: string
}

export const useSupabase = () => {
  const jwt = localStorage.getItem(supaConfig.jwtStorageKey)
  const [supabase, setSupabase] = (
    useState(createClient(supaConfig.url, supaConfig.anonKey))
  )
  const [error, setError] = useState<Maybe<string>>(null)

  useEffect(() => {
    setError(null)
    const build = async () => {
      try {
        if(!jwt) {
          throw new Error('No JWT found in localStorage.')
        }
        const { exp } = await decodeJWT(jwt)
        if(exp && exp < Date.now()) {
          localStorage.removeItem(supaConfig.jwtStorageKey)
          throw new Error(`JWT has expired (${new Date(exp).toLocaleString()}).`)
        }

        setSupabase(createClient(
          supaConfig.url,
          supaConfig.anonKey,
          { global: {
            headers: { Authorization: `Bearer ${jwt}` },
          } },
        ))
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
