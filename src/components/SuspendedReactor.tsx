import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { useAnimationFrame } from '../utils'
import { Drifter } from '../Drifter'
import { EmojiPicker } from './EmojiPicker'
import { KeyMap } from './KeyMap'
import { useSupabase } from '../lib/useSupabase'
import { Reactor } from './Reactor'
export const Video = ({url, videoRef}) => {

  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Reactor/>
    </Suspense>
  )
}

export default Video