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
              <li>Step #1: <Link to="/reactions">😶 Define Some Reactions</Link></li>
              <li>Step #2: <Link to="/videos">📽 React To A Video</Link></li>
              <li>Step #3: <Link to="/rubrics">🥅 Create A Rubrics</Link></li>
              <li>Optional: <Link to="/config">⚙ Configure The UI</Link></li>
              <li>Testing: <Link to="/selector">⛏ Reaction Selector</Link></li>
            </ul>
          </nav>
        </main>
      </section>
    )
  )
}

export default Home