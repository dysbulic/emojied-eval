import { useQuery } from '@tanstack/react-query'
import useSupabase from '../../lib/useSupabase'
import { image } from '../../lib/utils'
import FeedbackForm from '../FeedbackForm'
import { FormEvent, useRef } from 'react'
import tyl from './index.module.css'

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement,
  description: HTMLInputElement,
  grouped: HTMLInputElement,
}

export const FeedbackGroups = () => {
  const { supabase } = useSupabase()
  const { data: feedbacks, isLoading: loading, refetch } = useQuery({
    queryKey: ['FeedbackGroups', { supabase }],
    queryFn: async () => {
      if(!supabase) throw new Error('No `supabase defined.')
      const { data } = (
        await supabase.from('feedbacks')
        .select()
      )
      return data
    },
    enabled: !!supabase,
  })
  const addDialog = useRef<HTMLDialogElement>(null)

  const addClick = async () => {
    addDialog.current?.showModal()
  }

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    if(!supabase) throw new Error('Supabase not defined.')
    evt.preventDefault()
    const elements = evt.currentTarget.elements as FormElements
    const { data: group } = (
      await supabase.from('feedback_groups').insert({
        title: elements.title.value,
        description: elements.description.value,
      })
      .select()
      .single()
    ) ?? {}
    const feedbacks = (
      Object.values(elements.grouped)
      .filter((input) => input.checked)
      .map((input) => (
        {feedback_id: input.value, group_id: group.id}
      ))
    )
    await supabase?.from('feedbacks_groups').insert(feedbacks)
      
    refetch()

    evt.target.reset()
  }

  if(loading) return <p>Loading…</p>

  return (
    <section>
      <h1>Reactions</h1>
      <button onClick={addClick}>➕</button>
      <dialog ref={addDialog}>
        <FeedbackForm/>
      </dialog>
      <form {...{ onSubmit}}>
        <input id="title" required/>
        <input id="description"/>
        <ul className={tyl.olTable}>
          {feedbacks?.map((feedback) => (
            <li key={feedback.id}>
              <input type="checkbox" id="grouped" value={feedback.id}/>
              {image(feedback.image)}
              <h2>{feedback.title}</h2>
              <div>{feedback.description}</div>
            </li>
          ))}
        </ul>
      <button>Create Group</button>
      </form>
    </section>
  )
}

export default FeedbackGroups