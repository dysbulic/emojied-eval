import { Suspense } from 'react'
import { Reactor } from './Reactor'
export const SuspendedReactor = () => {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Reactor/>
    </Suspense>
  )
}

export default SuspendedReactor