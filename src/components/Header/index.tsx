import { ReactNode } from 'react'
import LoginButton from '../LoginButton'
import Logo from '../Logo'
import { Link } from 'react-router-dom'
import tyl from './index.module.css'

export const Header = (
  { children }: { children?: ReactNode }
) => (
  <header className={tyl.header}>
    <Link to="/"><Logo/></Link>
    {children}
    <LoginButton/>
  </header>
)

export default Header