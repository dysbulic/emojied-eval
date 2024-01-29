import { FormEvent } from 'react'
import { useSupabase } from '../../lib/useSupabase'

interface FormElements extends HTMLFormControlsCollection {
  image: HTMLInputElement,
  title: HTMLInputElement,
  description: HTMLInputElement,
}

export const FeedbackForm = () => {
  const { supabase } = useSupabase()
  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    if(!supabase) throw new Error('Supabase not defined.')
    const elements = evt.currentTarget.elements as FormElements
    await supabase.from('feedbacks').insert({
      image: elements.image.value,
      title: elements.title.value,
      description: elements.description.value,
    })
  }
  return (
    <form {...{ onSubmit }} method="dialog">
      <label>
        <h3>Image</h3>
        <input id="image" required/>
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

export default FeedbackForm