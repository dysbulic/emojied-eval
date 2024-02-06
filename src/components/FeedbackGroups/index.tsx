import { FormEvent, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import useSupabase from '../../lib/useSupabase'
import { image } from '../../lib/utils'
import FeedbackDialog from '../FeedbackDialog'
import Header from '../Header'
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
        await supabase.from('feedbacks').select()
      )
      return data
    },
    enabled: !!supabase,
  })
  const addDialog = useRef<HTMLDialogElement>(null)

  const addClick = async () => {
    addDialog.current?.showModal()
  }
  const onClose = useCallback(() => {
    refetch()
  }, [refetch])

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    if(!supabase) throw new Error('Supabase not defined.')
    evt.preventDefault()
    const elements = evt.currentTarget.elements as FormElements
    const checked = (
      Object.values(elements.grouped)
      .filter(({ checked }) => checked)
    )
    if(checked.length === 0) {
      throw new Error('No reactions selected.')
    }
    const { data: group } = (
      await supabase.from('feedback_groups').insert({
        title: elements.title.value,
        description: elements.description.value,
      })
      .select()
      .single()
    ) ?? {}
    const feedbacks = (
      checked
      .map(({ value: feedback_id }) => (
        { feedback_id, group_id: group.id }
      ))
    )
    await supabase?.from('feedbacks_groups').insert(feedbacks)

    evt.currentTarget.reset()
  }

  return (
    <section>
      <Header>
        <h1>Reactions</h1>
        <button onClick={addClick} className="square">➕</button>
      </Header>
      <FeedbackDialog
        ref={addDialog}
        {...{ onClose }}
      />
      <form {...{ onSubmit }}>
        {loading ? <p>Loading…</p> : (
          <ul className={[tyl.olTable, tyl['col-3']].join(' ')}>
            {feedbacks?.map((feedback) => (
              <li key={feedback.id}>
                <input type="checkbox" id="grouped" value={feedback.id}/>
                {image(feedback.image)}
                <h2>{feedback.name}</h2>
                <div>{feedback.description}</div>
              </li>
            ))}
          </ul>
        )}
        <section className={tyl.newGroup}>
          <input id="title" required placeholder="Title"/>
          <input id="description" className={tyl.description} placeholder="Description"/>
          <button>Create Group</button>
        </section>
      </form>
    </section>
  )
}

export default FeedbackGroups