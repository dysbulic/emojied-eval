import { useSIWE } from "connectkit"
import useSupabase from "../../lib/useSupabase"
import LoginButton from "../LoginButton"
import { Link } from "react-router-dom"
import tyl from './index.module.css'
import Header from "../Header"

export const Home = () => {
  const { supabase, error: supaError } = useSupabase()
  const { isSignedIn } = useSIWE()
  let content

  if(!isSignedIn) {
    content = <LoginButton/>
  } else if(supaError) {
    content = <p>Supabase Error: {supaError}</p>
  } else if(!supabase) {
    content = <p>Connecting to Supabase…</p>
  } else if(supabase.auth.getUser() == null) {
    content = <LoginButton className={tyl.main}/>
  }

  return (
    content ? (
      <section id={tyl.home} className={tyl.main}>
        <object data="/banner.svg"/>
        {content}
      </section>
    ) : (
      <section>
        <Header/>
        <main>
          <nav>
            <ul id={tyl.mainnav}>
              <li><Link to="/videos">Videos</Link></li>
              <li><Link to="/reactions">Reactions</Link></li>
              <li><Link to="/config">Configure</Link></li>
              <li><Link to="/selector">Reaction Selector</Link></li>
            </ul>
          </nav>
        </main>
      </section>
    )
  )
}

export default Home