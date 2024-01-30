import { FormEvent, useRef } from 'react'
import { useSupabase } from '../../lib/useSupabase'
import tyl from './index.module.css'

interface FormElements extends HTMLFormControlsCollection {
  url: HTMLInputElement,
  title: HTMLInputElement,
  description: HTMLInputElement,
}

export const VideoForm = (
  { close: closeForm }: { close: () => void }
) => {
  const { supabase } = useSupabase()
  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    if(!supabase) throw new Error('Supabase not defined.')
    const elements = evt.currentTarget.elements as FormElements
    await supabase.from('videos').insert({
      url: elements.url.value,
      title: elements.title.value,
      description: elements.description.value,
    })
  }
  const form = useRef<HTMLFormElement>(null)
  const close = () => {
    form.current?.reset()
    closeForm()
  }

  return (
    <form
      {...{ onSubmit }}
      method="dialog"
      className={tyl.form}
      ref={form}
    >
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
        <textarea id="description"/>
      </label>
      <div className={tyl.buttons}>
        <button type="button" onClick={close}>Cancel</button>
        <button>Create</button>
      </div>
    </form>
  )
}

export default VideoForm