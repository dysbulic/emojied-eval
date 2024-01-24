import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ethers } from 'https://esm.sh/ethers@6.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../lib/database.types.ts'
import { cors, nonce as genNonce } from '../lib/utils.ts';
import {
  Header,
  Payload,
  create as createJWT,
} from 'https://deno.land/x/djwt@v3.0.1/mod.ts'
// import { decode as b64Decode } from "https://deno.land/std/encoding/base64.ts"

function createErrorResponse({
  error,
  headers,
  statusCode = 400
}: {
  error: Error | string,
  headers: Headers,
  statusCode?: number,
}) {
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

  const { address, signature, nonce } = await req.json()

  const message = (
    `Authenticate ${address} for access using nonce: "${nonce}".`
  )
  const signer = ethers.verifyMessage(message, signature)

  if(signer !== address) {
    return createErrorResponse(
      `The message wasn’t signed by the expected address. ${signer} ≠ ${address}.`,
      headers,
    )
  }

  const supabase = createClient<Database>(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
  )
  const { data } = (
    await supabase.from('addresses')
    .select()
    .eq('address', address)
    .single()
  )
  if(data == null) {
    return createErrorResponse('The public user does not exist.', headers)
  }
  if(data.verification_nonce !== nonce) {
    return createErrorResponse(
      `The nonces do not match. ${nonce} ≠ ${data.verification_nonce}.`,
      headers,
    )
  }

  let authedUser
  if(!data.user_id) {
    const { data: { user }, error } = (
      await supabase.auth.admin.createUser({
        email: `${address}@ethereum.email`,
        email_confirm: true,
      })
    )
    if(error) {
      return createErrorResponse(error, headers)
    }
    authedUser = user
  } else {
    const { data: { user }, error } = (
      await supabase.auth.admin.getUserById(data.user_id)
    )
    if (error) {
      return createErrorResponse(error, headers)
    }
    authedUser = user
  }

  const newNonce = genNonce()
  const { error } = await supabase.from('addresses').update({
    verification_nonce: newNonce, // so it can't be reused
    updated_at: undefined,
    user_id: authedUser.id,
  })
  .eq('address', address)
  .select()

  if(error) {
    return createErrorResponse(error, headers)
  }

  const jwtSecret = Deno.env.get('JWT_SECRET')
  if (!jwtSecret) {
    throw new Error(
      'Please set the $JWT_SECRET environment variable.'
    )
  }

  const encoder = new TextEncoder()
  const rawJWTSecret = encoder.encode(jwtSecret)
  // const rawJWTSecret = b64Decode(jwtSecret)

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

  return new Response(
    JSON.stringify({ jwt }), { headers }
  )
})