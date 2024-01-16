import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ethers } from 'https://esm.sh/ethers@6.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../lib/database.types.ts'
import { nonce as genNonce } from '../lib/utils';
import {
  Header,
  Payload,
  create,
  getNumericDate,
} from 'https://deno.land/x/djwt@v2.9.1/mod.ts'

const SUPABASE_TABLE_USERS = 'users'

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

  const allowedOrigins = [
    /http:\/\/localhost(:\d+)?/,
    /https:\/\/smart-reader-kappa.vercel.app/,
  ]

  const headers = new Headers()
  if(allowedOrigins.some((exp) => exp.test(origin))) {
    headers.set('Access-Control-Allow-Origin', origin)
  }
  headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  )
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  headers.set('Access-Control-Allow-Credentials', 'true')

  if (method === 'OPTIONS') {
    return new Response(null, { headers })
  }

  const { address, signature, nonce } = await req.json()

  const message = (
    'I am signing this message to authenticate the nonce of'
    + ` "${nonce}" signed by ${address} to verify their wallet.`
  )
  const signer = ethers.verifyMessage(message, signature)

  if (signer === address) {
      console.debug('The message was signed by the expected address.')
  } else {
    return createErrorResponse(
      'The message wasn’t signed by the expected address.',
      headers,
    )
  }

  const supabase = createClient<Database>(
    Deno.env.get('SUPABASE_URL') as string,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string // service role key required for row creation/editing
  )
  const { data } = (
    await supabase
    .from(SUPABASE_TABLE_USERS)
    .select()
    .eq('address', address)
    .single()
  )
  if(data == null) {
    return createErrorResponse('The public user does not exist.', headers)
  }

  if (data?.auth.genNonce !== nonce) {
    return createErrorResponse(
      `The nonces do not match. ${nonce} ≠ ${data?.auth.genNonce}.`,
      headers,
    )
  }

  let authUser
  if(!data?.id) {
    const { data: userData, error } = await supabase.auth.admin.createUser({
      email: `${address}@email.com`, // we have to have this.. or a phone
      user_metadata: { address: address },
    })
    if(error) {
      console.error({ 'error creating user': error })
      return createErrorResponse(error.message, headers)
    }
    authUser = userData.user
  } else {
    const { data: userData, error } = await supabase.auth.admin.getUserById(
      data.id
    )

    if (error) {
      return createErrorResponse(error.message, headers)
    }
    authUser = userData.user
  }

  const newNonce = genNonce()

  await supabase
  .from(SUPABASE_TABLE_USERS)
  .update({
    auth: {
      genNonce: newNonce, // update the nonce, so it can't be reused
      lastAuth: new Date().toISOString(),
      lastAuthStatus: 'success',
    },
    id: authUser?.id, // same uuid as auth.users table
  })
  .eq('address', address) // primary key

  const jwtSecret = Deno.env.get('JWT_SECRET')

  if (!jwtSecret) {
    throw new Error('Please set the JWT_SECRET environment variable.')
  }

  const encoder = new TextEncoder()
  const jwtSecretUint8Array = encoder.encode(jwtSecret)

  console.log('creating key')
  const key = await crypto.subtle.importKey(
    'raw', // raw format the secret is a string
    jwtSecretUint8Array, //  JWT secret
    { name: 'HMAC', hash: 'SHA-512' },
    false, // whether the key is extractable
    ['sign', 'verify'], // key usages
  )
  const payload: Payload = {
    // iss: 'joe',
    address,
    sub: authUser?.id,
    exp: getNumericDate(3600),
  }
  const header: Header = {
    alg: 'HS512',
    typ: 'JWT',
  }
  const token = await create(header, payload, key)

  return new Response(
    JSON.stringify({ token }), { headers }
  )
})