import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import WalletProviders from './components/WalletProviders.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProviders><App/></WalletProviders>
  </React.StrictMode>,
)
