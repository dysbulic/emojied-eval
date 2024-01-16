// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  cors,
  nonce as genNonce,
  supaConfig,
} from '../lib/utils.ts'

const SUPABASE_USERS_TABLE = 'auth.users'

serve(async (req) => {
  const { method, headers: reqHeaders } = req
  const origin = reqHeaders.get('Origin')
  const headers = cors(origin)

  if(method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  const { address } = await req.json()
  const nonce = genNonce()

  const supabase = createClient(
    supaConfig.url, supaConfig.serviceRoleKey
  )
  const { status, statusText } = (
    await supabase.from(SUPABASE_USERS_TABLE).upsert(
      [{
        address,
        auth: {
          genNonce: nonce,
          lastAuth: new Date().toISOString(),
          lastAuthStatus: 'pending',
        },
      }],
      { onConflict: 'address' },
    )
    .select()
  )
  headers.append('Content-Type', 'application/json')

  if(status >= 400) {
    throw new Error(
      `Error Upserting User: "${statusText}" (${status})`
    )
  }

  return new Response(
    JSON.stringify({ nonce }), { headers }
  )
})