import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import WalletProviders from './components/WalletProviders.tsx'
import './index.css'
import { ConfigProvider } from './lib/ConfigContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProviders>
      <ConfigProvider>
        <App/>
      </ConfigProvider>
    </WalletProviders>
  </React.StrictMode>,
)
