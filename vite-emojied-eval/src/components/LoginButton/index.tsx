import { useAccount, useSignMessage } from 'wagmi'
import { HTMLAttributes, useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit';
import {
  endpoints, supabase as supaConfig,
} from '../../config.ts'
import tyl from './index.module.css'

export const LoginButton = (props: HTMLAttributes<HTMLElement>) => {
  const { address } = useAccount()
  const {
    data: signature, signMessage,
  } = useSignMessage()
  const [nonce, setNonce] = useState<string>()
  const [jwt, setJWT] = useState<string>()

  const login = async () => {
    const response = await fetch(endpoints.nonce, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supaConfig.anonKey}`,
      },
      body: JSON.stringify({ address }),
    })
    const { nonce } = await response.json()
    setNonce(nonce)
    const message = `Authenticate ${address} for access using nonce: "${nonce}".`
    signMessage({ message })
  }

  const logout = () => {
    localStorage.removeItem(supaConfig.jwtStorageKey)
    setJWT(undefined)
  }

  useEffect(() => {
    (async () => {
      if(signature) {
        const response = await fetch(endpoints.nonce, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supaConfig.anonKey}`,
          },
          body: JSON.stringify({ address, signature, nonce }),
        })
        const { jwt } = await response.json()
        localStorage.setItem(supaConfig.jwtStorageKey, jwt)
        setJWT(jwt)
      }
    })()
  }, [address, nonce, signature])

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

        return (
          <button className={tyl.login} onClick={logout}>
            Logout
          </button>
        )
      })()}
    </section>
  )
}

export default LoginButton