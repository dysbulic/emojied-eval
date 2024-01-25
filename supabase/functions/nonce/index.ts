import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  cors,
  nonce as genNonce,
  supaConfig,
} from '../lib/utils.ts'

const ADDRESSES_TABLE = 'addresses'

serve(async (req) => {
  try {
    const { method, headers: reqHeaders } = req
    const origin = reqHeaders.get('Origin')
    const headers = cors(origin)

    if(method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const { address } = await req.json()
    if(!address) throw new Error('Missing address.')

    const nonce = genNonce()

    console.debug({ supaConfig })

    const supabase = createClient(
      supaConfig.url, supaConfig.serviceRoleKey
    )
    const { status, statusText, error } = (
      await supabase.from(ADDRESSES_TABLE).upsert(
        [{
          address,
          verification_nonce: nonce,
        }],
        { onConflict: 'address' },
      )
      .select()
    )
    headers.append('Content-Type', 'application/json')

    if(status >= 400) {
      throw new Error(
        `Error Upserting User: "${statusText}" (${status})`,
        { cause: JSON.stringify(error, null, 2) },
      )
    }

    return new Response(
      JSON.stringify({ nonce }), { headers }
    )
  } catch(err) {
    console.error({ err })
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { status: 500 }
    )
  }
})