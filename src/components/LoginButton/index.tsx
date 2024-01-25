import { HTMLAttributes } from 'react'
import { ConnectKitButton } from 'connectkit';

export const LoginButton = (props: HTMLAttributes<HTMLElement>) => (
  <section {...props}>
    <ConnectKitButton/>
  </section>
)

export default LoginButton