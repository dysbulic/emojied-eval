import { createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    // Required
    alchemyId: (
      process.env.VITE_ALCHEMY_ID
      ?? (() => { throw new Error('Missing $ALCHEMY_ID') })()
    ), // or infuraId
    walletConnectProjectId: (
      process.env.VITE_WALLETCONNECT_PROJECT_ID
      ?? (() => {
        throw new Error('Missing $WALLETCONNECT_PROJECT_ID')
      })()
    ),
    appName: 'ClaimScore',

    // Optional
    appDescription: 'Scoring interface with collaborative evaluation by Dysbulic and Tenfinney.',
    appUrl: "https://claimscore.freeweb3.com",
    // appIcon: "https://code.trwb.live/logo.svg", // no bigger than 1024x1024px (max. 1MB)
  }),
)

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
