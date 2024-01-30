import LoginButton from '../LoginButton'
// import Logo from '../Logo'
import tyl from './index.module.css'


export const Header = () => (
  <header className={tyl.header}>
    {/* <Logo/> */}
    <LoginButton/>
  </header>
)

export default Header