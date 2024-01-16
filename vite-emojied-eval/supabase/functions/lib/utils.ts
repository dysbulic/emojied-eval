import {
  cryptoRandomString
} from 'https://deno.land/x/crypto_random_string@1.0.0/mod.ts'

export const cors = (origin: string) => {
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

  return headers
}

export const nonce = (length = 13) => (
  cryptoRandomString({ length, type: 'url-safe' })
)

export const supaConfig = {
  url: (
    Deno.env.get('SUPABASE_URL')
    ?? (() => { throw new Error(
      'Missing $SUPABASE_URL.'
    ) })()
  ),
  serviceRoleKey: (
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    ?? (() => { throw new Error(
      'Missing $SUPABASE_SERVICE_ROLE_KEY.'
    ) })()
  ),
}
