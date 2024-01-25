import {
  ConnectKitProvider, SIWEProvider,
} from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { WagmiConfig } from 'wagmi'
import { ConnectKit as CKConfig, SIWE as SIWEConfig } from '../config'
import { useState } from 'react'

export function WalletProviders(
  { children }: { children: React.ReactNode }
) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig config={CKConfig}>
      <SIWEProvider {...SIWEConfig}>
        <ConnectKitProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  )
}

export default WalletProviders