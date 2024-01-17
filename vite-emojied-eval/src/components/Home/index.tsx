import LoginButton from "../LoginButton"
import tyl from './index.module.css'

export const Home = () => (
  <section id="home">
    <img src="/logo.svg" alt="Serial Mobbing"/>
    <LoginButton className={tyl.main}/>
  </section>
)

export default Home