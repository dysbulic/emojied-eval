import useSupabase from "../../lib/useSupabase"
import LoginButton from "../LoginButton"
import Videos from "../Videos"
import tyl from './index.module.css'

export const Home = () => {
  const { supabase, hasJWT, error: supaError } = useSupabase()
  let content = <Videos/>

  if(!hasJWT) {
    content = <LoginButton/>
  } else if(supaError) {
    content = <p>Supabase Error: {supaError}</p>
  } else if(!supabase) {
    content = <p>Connecting to Supabase…</p>
  } else if(supabase.auth.getUser() == null) {
    content = <LoginButton className={tyl.main}/>
  }

  return (
    <section id="home" className={tyl.main}>
      <img src="/logo.svg" alt="Serial Mobbing"/>
      {content}
    </section>
  )
}

export default Home