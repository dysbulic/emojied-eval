'use client'

import { ConnectKitProvider, type SIWESession} from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { WagmiConfig } from 'wagmi'
import { siweClient } from '@/utils/siwe/client'
import { config } from '@/connectkit'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <siweClient.Provider
      enabled={true}
      nonceRefetchInterval={5 * 60 * 1000}
      sessionRefetchInterval={5 * 60 * 1000}
      signOutOnDisconnect={true}
      signOutOnAccountChange={true}
      signOutOnNetworkChange={true}
      onSignIn={(session?: SIWESession) => {}}
      onSignOut={() => {}}
    >
      <WagmiConfig {...{ config }}>
        <ConnectKitProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
              {children}
            </ReactQueryStreamedHydration>
          </QueryClientProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </siweClient.Provider>
  )
}

