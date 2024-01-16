'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  const login = async () => {
  }

  return (
    <main className={styles.main}>
      <button onClick={login}>Authenticate</button>
    </main>
  )
}
