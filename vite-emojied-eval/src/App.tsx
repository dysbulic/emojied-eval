import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { AppContextProvider, useAppContext } from "./context/appContext";
import { Toaster } from 'react-hot-toast';
import "./App.css";
import Home from './components/Home';
import Configuration from './components/Configuration';
import Reactor from './components/Reactor';

export const App = () => (
  <main>
    <Toaster/>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/config" element={<Configuration/>}/>
        <Route path="/view" element={<Reactor/>}/>
      </Routes>
    </Router>
  </main>
)

export default App