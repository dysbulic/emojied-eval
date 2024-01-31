import { FormEvent, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../../lib/useSupabase'
import tyl from './index.module.css'
import { LiaEmber } from 'react-icons/lia'

interface FormElements extends HTMLFormControlsCollection {
  url: HTMLInputElement
  title: HTMLInputElement
  description: HTMLInputElement
  group: HTMLSelectElement
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
      feedback_group_id: elements.group.value,
    })
  }
  const form = useRef<HTMLFormElement>(null)
  const close = () => {
    form.current?.reset()
    closeForm()
  }

  const {
    isLoading: loading, error: queryError, data: groups,
  } = useQuery({
    queryKey: ['VideoForm', { supabase }],
    enabled: !!supabase,
    queryFn: async () => {
      const { data, error } = (
        await supabase?.from('feedback_groups').select()
      ) ?? {}
      if(error) throw error 
      return data
    }
  })
  if(queryError) throw queryError
  if(loading) return <h1>Loading…</h1>

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
      <label>
        <h3>Feedback Group</h3>
        <select id="group">
          {groups?.map((group) => (
            <option key={group.id} value={group.id}>{group.title}</option>
          ))}
        </select>
      </label>
      <div className={tyl.buttons}>
        <button type="button" onClick={close}>Cancel</button>
        <button>Create</button>
      </div>
    </form>
  )
}

export default VideoForm