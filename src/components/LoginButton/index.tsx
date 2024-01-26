import { HTMLAttributes } from 'react'
import { ConnectKitButton, useModal } from 'connectkit'
import { supabase as supaConfig } from '../../config' 

export const LoginButton = (props: HTMLAttributes<HTMLElement>) => {
  useModal({ onDisconnect: () => (
    localStorage.removeItem(supaConfig.jwtStorageKey)
  )})
  return (
    <section {...props}>
      <ConnectKitButton/>
    </section>
  )
}

export default LoginButton