import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { supabase as supaConfig } from '../config.ts'
import { decodeJwt as decodeJWT } from 'jose'
import { useEffect, useState } from 'react'

type Maybe<T> = T | null
export type ReturnType = {
  supabase: Maybe<SupabaseClient>
  hasJWT: boolean
  error?: string
}

export const useSupabase = () => {
  const [supabase, setSupabase] = useState<Maybe<SupabaseClient>>(null)
  const [error, setError] = useState<Maybe<string>>(null)

  useEffect(() => {
    const build = async () => {
      try {
        const jwt = localStorage.getItem(supaConfig.jwtStorageKey)
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
          jwt,
        ))
      } catch(err) {
        setError((err as Error).message)
      }
    }
    build()
  }, [])

  const ret: ReturnType = {
    supabase,
    hasJWT: !!localStorage.getItem(supaConfig.jwtStorageKey),
  }
  if(error) ret.error = error
  return ret
}

export default useSupabase
