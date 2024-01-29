import { FormEvent } from 'react'
import { useSupabase } from '../lib/useSupabase'

interface FormElements extends HTMLFormControlsCollection {
  url: HTMLInputElement,
  title: HTMLInputElement,
  description: HTMLInputElement,
}

export const VideoForm = () => {
  const { supabase } = useSupabase()
  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if(!supabase) throw new Error('Supabase not defined.')
    const elements = evt.currentTarget.elements as FormElements
    await supabase.from('videos').insert({
      url: elements.url.value,
      title: elements.title.value,
      description: elements.description.value,
    })
  }
  return (
    <form {...{ onSubmit }} method="dialog">
      <label>
        <h3>URL</h3>
        <input id="url" required/>
      </label>
      <label>
        <h3>Title</h3>
        <input id="title"/>
      </label>
      <label>
        <h3>Description</h3>
        <input id="description"/>
      </label>
      <button>Create</button>
    </form>
  )
}

export default VideoForm