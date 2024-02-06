import { Fragment, HTMLAttributes, ReactNode } from 'react'
import { ConnectKitButton, useModal } from 'connectkit'
import { supabase as supaConfig } from '../../config' 

const Section = (
  { children, ...props }: { children: ReactNode }
) => (
  <section {...props}>{children}</section>
)

export const LoginButton = (props: HTMLAttributes<HTMLElement>) => {
  useModal({ onDisconnect: () => (
    localStorage.removeItem(supaConfig.jwtStorageKey)
  )})
  const Tag = Object.keys(props).length > 0 ? Section : Fragment
  return (
    <Tag {...props}>
      <ConnectKitButton/>
    </Tag>
  )
}

export default LoginButton