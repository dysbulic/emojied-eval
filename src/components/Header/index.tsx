import { ConnectKitButton } from "connectkit"
import LoginButton from '../LoginButton';

export const Header = () => (
  <header>
    <Logo/>
    <ConnectKitButton/>
    <LoginButton/>
  </header>
)

export default Header