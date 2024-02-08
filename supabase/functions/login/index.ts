import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SiweMessage, SiweErrorType } from 'https://esm.sh/siwe'
import {
  Header, Payload, create as createJWT,
} from 'https://deno.land/x/djwt@v3.0.1/mod.ts'
import { Database } from '../lib/database.types.ts'
import { cors, getSession } from '../lib/utils.ts';
import {
  decode as b64Decode
} from "https://deno.land/std/encoding/base64.ts"

function createErrorResponse({
  error,
  headers,
  statusCode = 400
}: {
  error: Error | string,
  headers: Headers,
  statusCode?: number,
}) {
  console.error({ error })
  headers.append('Content-Type', 'application/json')
  return new Response(
    JSON.stringify({ error: error.message ?? error }),
    { status: statusCode, headers },
  )
}

serve(async (req) => {
  const { method, headers: reqHeaders } = req
  const origin = reqHeaders.get('Origin')
  const headers = cors(origin)

  if (method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  try {
    const iron = await getSession({
      reqHeaders, resHeaders: headers,
    })
    const { message, signature } = await req.json()
    const msg = new SiweMessage(message)
    const { data: { address, chainId } } = (
      await msg.verify({ signature, nonce: iron.nonce })
    )

    iron.nonce = undefined
    iron.address = address
    iron.chainId = chainId
    await iron.save();

    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') as string,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    )

    const { data: byAddy, error } = (
      await supabase.from('addresses').upsert(
        [{ address }], { onConflict: 'address' },
      )
      .single()
      .select()
    )
    if(error) {
      return createErrorResponse({ error, headers })
    }

    let authedUser
    if(!byAddy.user_id) {
      const { data: { user }, error: lookupError } = (
        await supabase.auth.admin.createUser({
          email: `${address}@ethereum.email`,
          email_confirm: true,
        })
      )
      if(lookupError) {
        return createErrorResponse({
          error: lookupError, headers
        })
      }
      authedUser = user

      const { updateError } = (
        await supabase.from('addresses').update({
          updated_at: undefined,
          user_id: authedUser.id,
        })
        .eq('address', address)
        .select()
      )
      if(updateError) {
        return createErrorResponse({ error: updateError, headers })
      }
    } else {
      const { data: { user }, error } = (
        await supabase.auth.admin.getUserById(byAddy.user_id)
      )
      if (error) {
        return createErrorResponse({ error, headers })
      }
      authedUser = user
    }

    const jwtSecret = Deno.env.get('JWT_SECRET')
    if (!jwtSecret) {
      throw new Error(
        'Please set the $JWT_SECRET environment variable.'
      )
    }

    const rawJWTSecret = (
      Deno.env.get('JWT_SECRET_B64') ? (
        b64Decode(jwtSecret)
      ) : (
        new TextEncoder().encode(jwtSecret)
      )
    )

    const key = await crypto.subtle.importKey(
      'raw', // format of the key's data
      rawJWTSecret,
      { name: 'HMAC', hash: 'SHA-256' },
      true, // whether the key is extractable
      ['sign', 'verify'], // key usages
    )

    const payload: Payload = {
      iss: 'https://code.trwb.live',
      sub: authedUser.id,
      aud: authedUser.aud,
      email: authedUser.email,
      role: authedUser.role,
      address,
      exp: new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
    }
    const header: Header = { alg: 'HS256', typ: 'JWT' }
    const jwt = await createJWT(header, payload, key)

    headers.append('Content-Type', 'text/plain')
    return new Response(jwt, { headers })
  } catch (error) {
    switch (error) {
      case SiweErrorType.INVALID_NONCE:
      case SiweErrorType.INVALID_SIGNATURE: {
        return createErrorResponse({
          error, headers, statusCode: 422,
        })
      }
      default: {
        return createErrorResponse({
          error, headers, statusCode: 400,
        })
      }
    }
  }
})