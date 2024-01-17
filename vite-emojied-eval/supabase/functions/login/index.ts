import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ethers } from 'https://esm.sh/ethers@6.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../lib/database.types.ts'
import { cors, nonce as genNonce } from '../lib/utils.ts';
import {
  Header,
  Payload,
  create as createJWT,
  decode,
  getNumericDate,
} from 'https://deno.land/x/djwt@v3.0.1/mod.ts'

function createErrorResponse(
  error: string,
  headers: Headers,
  statusCode = 400
) {
  console.debug({ error })
  headers.append('Content-Type', 'application/json')
  return new Response(
    JSON.stringify({ error }),
    { headers, status: statusCode },
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
    `Authenticate ${address} for access using "${nonce}".`
  )
  const signer = ethers.verifyMessage(message, signature)

  if(signer === address) {
    console.debug('The message was signed by the expected address.')
  } else {
    return createErrorResponse(
      `The message wasn’t signed by the expected address. ${signer} ≠ ${address}.`,
      headers,
    )
  }

  const supabase = createClient<Database>(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string // service role key required for row creation/editing
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
      `The nonces do not match. ${nonce} ≠ ${data?.auth.genNonce}.`,
      headers,
    )
  }

  console.debug({ data })

  let authedUser
  if(!data.user_id) {
    const { data: { user }, error } = (
      await supabase.auth.admin.createUser({
        email: `${address}@ethereum.email`,
        email_confirm: true,
      })
    )
    if(error) {
      console.error({ 'error creating user': error })
      return createErrorResponse(error.message, headers)
    }
    authedUser = user
  } else {
    const { data: { user }, error } = (
      await supabase.auth.admin.getUserById(data.user_id)
    )
    if (error) {
      return createErrorResponse(error.message, headers)
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
    return createErrorResponse(error.message, headers)
  }

  const jwtSecret = Deno.env.get('JWT_SECRET')
  if (!jwtSecret) {
    throw new Error('Please set the $JWT_SECRET environment variable.')
  }

  const encoder = new TextEncoder()
  const jwtSecretUint8Array = encoder.encode(jwtSecret)

  console.debug({ kl: jwtSecretUint8Array.length })

  const key = await crypto.subtle.importKey(
    'raw', // format of the key's data
    jwtSecretUint8Array,
    { name: 'HMAC', hash: 'SHA-256' },
    true, // whether the key is extractable
    ['sign', 'verify'], // key usages
  )
  const payload: Payload = {
    // iss: 'joe',
    aud: authedUser.aud,
    email: authedUser.email,
    role: authedUser.role,
    address,
    sub: authedUser.id,
    exp: getNumericDate(60 * 60),
  }
  const header: Header = { alg: 'HS256', typ: 'JWT' }
  const jwt = await createJWT(header, payload, key)

  console.dir(await decode(jwt))
  console.dir(await decode(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')))

  return new Response(
    JSON.stringify({ token: jwt }), { headers }
  )
})