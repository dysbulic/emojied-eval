import { createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit'
import { SiweMessage } from 'siwe'

export const ConnectKit = createConfig(
  getDefaultConfig({
    alchemyId: (
      import.meta.env.VITE_ALCHEMY_ID
      ?? (() => { throw new Error('Missing $VITE_ALCHEMY_ID') })()
    ), // or infuraId
    walletConnectProjectId: (
      import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
      ?? (() => { throw new Error('Missing $VITE_WALLETCONNECT_PROJECT_ID') })()
    ),
    appName: 'Serial Mobbing',
    appDescription: 'Mob programming interface with collaborative evaluation.',
    appUrl: "https://codescore.freeweb3.com",
    // appIcon: "https://code.trwb.live/logo.svg", // no bigger than 1024x1024px (max. 1MB)
  }),
)

export const supabase = {
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  // url: 'https://jurofxjocjfgtkcwofmn.supabase.co',
  url: 'http://localhost:54321',
  jwtStorageKey: 'supabase-auth-jwt',
}
export const endpointNames = [
  'login', 'nonce', 'session', 'logout',
] as const

export const endpoints = (
  Object.fromEntries(endpointNames.map((name) => [
    name, `${supabase.url}/functions/v1/${name}`
  ]))
)

export const anonSupaFunc = async (
  name: keyof typeof endpoints, args: unknown = {}
) => {
  if(!endpoints[name]) {
    throw new Error(`No endpoint for ${name}.`)
  }

  const response = await fetch(endpoints[name], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabase.anonKey}`,
    },
    body: JSON.stringify(args),
    credentials: 'include',
  })

  if(!response.ok) return { error: response.statusText }

  const text = await response.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch(err) { null }

  return { response, text, json }
}

export const SIWE = {
  getNonce: async () => {
    const { text: nonce, error } = (
      await anonSupaFunc('nonce')
    )
    if(error) throw new Error(error)
    if(!nonce) throw new Error('No nonce returned.')
    return nonce
  },
  createMessage: (
    { nonce, address, chainId }:
    { nonce: string, address: string, chainId: number }
  ) => (
    new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // ASCII assertion to sign. Must not contain `\n`.
      statement: 'Sign-In With Ethereum to Serial Mobbing.',
    }).prepareMessage()
  ),
  verifyMessage: async (
    { message, signature }:
    { message: string, signature: string }
  ) => {
    const { text: jwt, error } = await anonSupaFunc(
      'login', { message, signature }
    )
    if(error) throw new Error(error)
    if(!jwt) throw new Error('No JWT returned.')
    localStorage.setItem(supabase.jwtStorageKey, jwt)
    return true
  },
  getSession: async () => {
    const { json, error } = await anonSupaFunc('session')
    if(error) throw new Error(error)
    return json
  },
  signOut: async () => {
    const { error } = await anonSupaFunc('logout')
    if(error) throw new Error(error)
    return true
  },
}

declare module 'wagmi' {
  interface Register {
    config: typeof ConnectKit
  }
}
