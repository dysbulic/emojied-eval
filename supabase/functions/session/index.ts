import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { cors, getSession } from '../lib/utils.ts'

serve(async (req) => {
  const { method, headers: reqHeaders } = req
  const origin = reqHeaders.get('Origin')
  const headers = cors(origin)
  headers.append('Content-Type', 'appplication/json')

  try {
    if(method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const iron = await getSession({
      reqHeaders, resHeaders: headers,
    })

    return new Response(
      { address: iron.address, chainId: iron.chainId },
      { headers },
    )
  } catch(err) {
    console.error({ err })
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { status: 500 }
    )
  }
})