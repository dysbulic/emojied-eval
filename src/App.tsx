import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './components/Home'
import Configuration from './components/Configuration'
import Reactor from './components/Reactor'
import SuspendedReactor from './components/SuspendedReactor'
import FeedbackGroups from './components/FeedbackGroups'
import Videos from './components/Videos'
import ReactionSelector from './components/ReactionSelector'
import './App.css'

export const App = () => (
  <main>
    <Toaster/>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/config" element={<Configuration/>}/>
        <Route path="/view" element={<Reactor/>}/>
        <Route path="/selector" element={<ReactionSelector/>}/>
        <Route path="/videos" element={<Videos/>}/>
        <Route path="/eval/:uuid" element={<SuspendedReactor/>}/>
        <Route path="/reactions" element={<FeedbackGroups/>}/>
      </Routes>
    </Router>
  </main>
)

export default App