import { ConnectKitProvider /*, type SIWESession*/} from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { WagmiConfig } from 'wagmi'
import { ConnectKit as CKConfig } from '../config'
import { useState } from 'react'

export function WalletProviders(
  { children }: { children: React.ReactNode }
) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig config={CKConfig}>
      <ConnectKitProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default WalletProviders