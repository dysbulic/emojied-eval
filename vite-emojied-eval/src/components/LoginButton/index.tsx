import { useAccount } from 'wagmi'
import { nonceEndpoint, supabase as supaConfig } from '../../config'
import tyl from './index.module.css'

export const LoginButton = () => {
  const { address } = useAccount()
  const login = async () => {
    fetch(nonceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supaConfig.anonKey}`,
      },
      body: JSON.stringify({ address }),
    })
  }

  return (
    <button className={tyl.login} onClick={login}>
      {address ? 'Login' : 'Connect Wallet'}
    </button>
  )
}

export default LoginButton