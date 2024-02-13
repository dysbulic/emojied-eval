import { HTMLAttributes, ReactNode } from 'react'
import LoginButton from '../LoginButton'
import Logo from '../Logo'
import { Link } from 'react-router-dom'
import { here } from '../../lib/utils'
import tyl from './index.module.css'

export const Header = (
  { children, className, ...props }:
  {
    children?: ReactNode
    className?: string
    props: HTMLAttributes<HTMLHeadingElement>
  }
) => (
  <header
    className={
      [className, tyl.header]
      .filter(here)
      .join(', ')
    }
    {...props}
  >
    <Link to="/"><Logo/></Link>
    {children}
    <LoginButton/>
  </header>
)

export default Header