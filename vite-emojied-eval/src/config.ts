import { createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit'

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
    appUrl: "https://code.trwb.live",
    appIcon: "https://code.trwb.live/logo.svg", // no bigger than 1024x1024px (max. 1MB)
  }),
)

declare module 'wagmi' {
  interface Register {
    config: typeof ConnectKit
  }
}

export const supabase = {
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
}
export const nonceEndpoint = 'http://localhost:54321/functions/v1/nonce'