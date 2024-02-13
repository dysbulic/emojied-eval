import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { cors, getSession, ironSessionConfig } from '../lib/utils.ts'
import { unsealData } from 'https://esm.sh/iron-session@latest'
import { getCookies } from 'https://deno.land/std/http/mod.ts'

serve(async (req) => {
  const { method, headers: reqHeaders } = req
  const origin = reqHeaders.get('Origin')
  const headers = cors(origin)
  headers.append('Content-Type', 'appplication/json')

  try {
    if(method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') as string,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    )
    const session = await supabase.auth.getSession()
    console.debug({ session })

    const iron = await getSession({
      reqHeaders, resHeaders: headers,
    })
    let ret = iron
    if(!(ret.address && ret.chainId)) {
      const cookie = (
        getCookies(reqHeaders)?.[ironSessionConfig.cookieName]
      )
      if(cookie) {
        console.debug('Manually parsing cookie.')
        ret = await unsealData(cookie, {
          password: ironSessionConfig.password,
          ttl: 60 * 60 * 24 * 14,
        })
      }
    }

    return new Response(
      JSON.stringify(ret), { headers },
    )
  } catch(err) {
    console.error({ err })
    return new Response(
      JSON.stringify({ error: err.message, stack: err.stack }),
      { status: 500 }
    )
  }
})