import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './components/Home'
import Configuration from './components/Configuration'
import Reactor from './components/Reactor'
import SuspendedReactor from './components/SuspendedReactor'
import FeedbackGroups from './components/FeedbackGroups'
import Videos from './components/Videos'
import Reactions from './components/Reactions'
import Score from './components/Score'
import './App.css'

export const App = () => (
  <main>
    <Toaster/>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/config" element={<Configuration/>}/>
        <Route path="/view" element={<Reactor/>}/>
        <Route path="/selector/:uuid" element={<Reactions/>}/>
        <Route path="/selector" element={<Reactions/>}/>
        <Route path="/videos" element={<Videos/>}/>
        <Route path="/eval/:uuid" element={<SuspendedReactor/>}/>
        <Route path="/reactions" element={<FeedbackGroups/>}/>
        <Route path="/score/:uuid" element={<Score/>}/>
      </Routes>
    </Router>
  </main>
)

export default App