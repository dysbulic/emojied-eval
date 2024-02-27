import React, { Suspense } from 'react' // This is the only line that changed
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import { Rubrics } from './components/Rubrics'

const Home = React.lazy(() => import('./components/Home'))
const Configuration = React.lazy(() => import('./components/Configuration'))
const Reactor = React.lazy(() => import('./components/Reactor'))
const SuspendedReactor = React.lazy(() => import('./components/SuspendedReactor'))
const FeedbackGroups = React.lazy(() => import('./components/FeedbackGroups'))
const Videos = React.lazy(() => import('./components/Videos'))
const Reactions = React.lazy(() => import('./components/Reactions'))
const Score = React.lazy(() => import('./components/Score'))

export const App = () => (
  <main>
    <Toaster/>
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<em>Loading Home…</em>}>
            <Home/>
          </Suspense>
        }/>
        <Route path="/config" element={
          <Suspense fallback={<em>Loading Configuration…</em>}>
            <Configuration/>
          </Suspense>
        }/>
        <Route path="/view" element={
          <Suspense fallback={<em>Loading Reactor…</em>}>
            <Reactor/>
          </Suspense>
        }/>
        <Route path="/selector/:uuid" element={
          <Suspense fallback={<em>Loading Reactions…</em>}>
            <Reactions/>
          </Suspense>
        }/>
        <Route path="/selector" element={
          <Suspense fallback={<em>Loading Videos…</em>}>
            <Reactions/>
          </Suspense>
        }/>
        <Route path="/videos" element={
          <Suspense fallback={<em>Loading Videos…</em>}>
            <Videos/>
          </Suspense>
        }/>
        <Route path="/eval/:uuid" element={
          <Suspense fallback={<em>Loading Suspended Reactor…</em>}>
            <SuspendedReactor/>
          </Suspense>
        }/>
        <Route path="/reactions" element={
          <Suspense fallback={<em>Loading Feedback Groups…</em>}>
            <FeedbackGroups/>
          </Suspense>
        }/>
        <Route path="/score/:uuid" element={
          <Suspense fallback={<em>Loading Score…</em>}>
            <Score/>
          </Suspense>
        }/>
        <Route path="/rubrics" element={
          <Suspense fallback={<em>Loading Rubrics…</em>}>
            <Rubrics/>
          </Suspense>
        }/>
      </Routes>
    </Router>
  </main>
)

export default App