import { useAccount, useSignMessage } from 'wagmi'
import { HTMLAttributes, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  nonceEndpoint, loginEndpoint, supabase as supaConfig,
} from '../../config.ts'
import tyl from './index.module.css'
import { ConnectKitButton } from 'connectkit';

export const LoginButton = (props: HTMLAttributes<HTMLElement>) => {
  const { address } = useAccount()
  const {
    data: signature, signMessage,
  } = useSignMessage()
  const [nonce, setNonce] = useState<string>()
  const [jwt, setJWT] = useState<string>()

  const login = async () => {
    const response = await fetch(nonceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supaConfig.anonKey}`,
      },
      body: JSON.stringify({ address }),
    })
    const { nonce } = await response.json()
    setNonce(nonce)
    const message = `Authenticate ${address} for access using "${nonce}".`
    signMessage({ message })
  }

  useEffect(() => {
    (async () => {
      if(signature) {
        const response = await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supaConfig.anonKey}`,
          },
          body: JSON.stringify({ address, signature, nonce }),
        })
        const { jwt } = await response.json()
        localStorage.setItem('supabase-auth-jwt', jwt)
        setJWT(jwt)
      }
    })()
  }, [address, nonce, signature])

  const testUser = async () => {
    const headers = { Authorization: `Bearer ${jwt}` }
    const supabase = await createClient(
      supaConfig.url,
      supaConfig.anonKey,
      { global: { headers } },
    )
    console.dir(await supabase.auth.getUser())
  }

  return (
    <section {...props}>
      <ConnectKitButton/>
      {(() => {
        if(!address) return null

        if(!jwt) return (
          <button className={tyl.login} onClick={login}>
            {address ? 'Login' : 'Connect Wallet'}
          </button>
        )

        return <button onClick={testUser}>Test User</button>
      })()}
    </section>
  )
}

export default LoginButton