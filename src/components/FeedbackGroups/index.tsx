import {
  FormEvent, useCallback, useEffect, useRef, useState,
} from 'react'
import JSON5 from 'json5';
import Papa from 'papaparse'
import useSupabase from '../../lib/useSupabase'
import { emoji } from '../../lib/utils'
import FeedbackDialog from '../FeedbackDialog'
import Header from '../Header'
import { Feedback } from '../ReactionSelector'
import FeedbackBulkAddDialog from '../FeedbackBulkAddDialog'
import DisplayDialog from '../DisplayDialog'
import { useFeedbacks, useGroups, useSelected } from './queries'
import tyl from './index.module.css'

interface EditFormElements extends HTMLFormControlsCollection {
  group: HTMLSelectElement
}
interface NewFormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement
  description: HTMLInputElement
  grouped: HTMLInputElement
}
type CheckState = Record<string, boolean>

export const FeedbackGroups = () => {
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [uuid, setUUID] = useState<string>()
  const [uuidHold, setUUIDHold] = useState<string>()
  const [editing, setEditing] = useState<Feedback>()
  const [checks, setChecks] = useState<CheckState>({})
  const bulkDialog = useRef<HTMLDialogElement>(null)
  const displayDialog = useRef<HTMLDialogElement>(null)
  const [output, setOutput] = useState<string>()
  const { supabase } = useSupabase()
  const {
    data: feedbacks,
    isLoading: loadingFeedbacks,
    refetch: refetchFeedbacks,
  } = useFeedbacks(supabase)
  const {
    data: groups,
    isLoading: loadingGroups,
    refetch: refetchGroups,
  } = useGroups(supabase)
  const {
    data: selected,
    isLoading: loadingSelected,
  } = useSelected(supabase, uuid)
  useEffect(() => {
    if(selected) {
      setChecks(() => {
        const next: CheckState = {}
        for(const id of selected) {
          next[id] = true
        }
        return next
      })
    }
  }, [selected])
  const addDialog = useRef<HTMLDialogElement>(null)

  const addClick = async () => {
    setEditing(undefined)
    addDialog.current?.showModal()
  }
  const editClick = (feedback: Feedback) => {
    setEditing(feedback)
    addDialog.current?.showModal()
  }
  const onClose = useCallback(() => {
    refetchFeedbacks()
  }, [refetchFeedbacks])

  const onGroupEdit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const elements = evt.currentTarget.elements as EditFormElements
    const uuid = elements.group.value
    setUUID(uuid)
    const group = groups?.find(({ id }) => id === uuid)
    if(uuid && !group) throw new Error(`Group "${uuid}" not found.`)
    setTitle(group?.title)
    setDescription(group?.description)
  }

  const resetForm = () => {
    setUUID(undefined)
    setUUIDHold(undefined)
    setTitle(undefined)
    setDescription(undefined)
    setChecks({})
  }

  const onNewGroup = async (evt: FormEvent<HTMLFormElement>) => {
    if(!supabase) throw new Error('Supabase not defined.')
    evt.preventDefault()
    const elements = evt.currentTarget.elements as NewFormElements
    const checked = (
      Object.values(elements.grouped)
      .filter(({ checked }) => checked)
    )
    if(checked.length === 0) {
      throw new Error('No reactions selected.')
    }
    const values = {
      title: elements.title.value,
      description: elements.description.value,
      id: undefined as unknown,
    }
    if(uuid) {
      values.id = uuid
    }
    const { data: group } = (
      await supabase.from('feedback_groups')
      .upsert(values)
      .select()
      .single()
    ) ?? {}
    const feedbacks = (
      checked
      .map(({ value: feedback_id }) => (
        { feedback_id, group_id: group.id }
      ))
    )
    await supabase?.from('feedbacks_groups')
    .delete()
    .eq('group_id', group.id)

    await supabase?.from('feedbacks_groups')
    .insert(feedbacks)

    resetForm()
    refetchGroups()
  }

  const deleteGroup = async (uuid: string) => {
    if(!supabase) throw new Error('`supabase` not defined.')
    await supabase.from('feedback_groups')
    .delete()
    .eq('id', uuid)

    resetForm()
    refetchGroups()
  }

  return (
    <section>
      <Header>
        <h1>Reactions</h1>
        <button onClick={addClick} className="square">➕</button>
      </Header>
      <FeedbackDialog
        ref={addDialog}
        feedback={editing}
        {...{ onClose }}
      />
      <FeedbackBulkAddDialog
        ref={bulkDialog}
        {...{ onClose }}
      />
      {loadingGroups ? <p>Loading…</p> : (
        <form onSubmit={onGroupEdit} id={tyl.edit}>
          <select
            id="group"
            value={uuidHold ?? ''}
            onChange={({ target: { value } }) => {
              setUUIDHold(value)
            }}
          >
            <option value="">None</option>
            {groups?.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >{group.title}</option>
            ))}
          </select>
          <button>Edit Group</button>
          <button
            type="button"
            onClick={() => {
              bulkDialog.current?.showModal()
            }}
          >Bulk Add Groups</button>
          <button
            type="button"
            onClick={() => {
              displayDialog.current?.showModal()
              setOutput(JSON5.stringify(groups, null, 2))
            }}
          >Export as JSON5</button>
          <button
            type="button"
            onClick={() => {
              displayDialog.current?.showModal()
              setOutput(Papa.unparse([{test: 'pne'}, {test: 'two'}], { header: true }))
            }}
          >Export as CSV</button>
        </form>
      )}
      <DisplayDialog ref={displayDialog}>
        <pre>{output}</pre>
      </DisplayDialog>
      <form onSubmit={onNewGroup} id={tyl.new}>
        {loadingFeedbacks || (!!uuid && loadingSelected) ? (
          <p>Loading…</p>
        ) : (
          <>
            {feedbacks?.map((feedback) => (
              <label key={feedback.id}>
                <input
                  type="checkbox"
                  id="grouped"
                  value={feedback.id}
                  checked={checks[feedback.id] ?? false}
                  onChange={({ target: { checked } }) => (
                    setChecks((checks) => ({
                      ...checks,
                      [feedback.id]: checked,
                    }))
                  )}
                />
                {emoji(feedback.image)}
                <h2>{feedback.name}</h2>
                <div className={tyl.center}>{feedback.description}</div>
                <button
                  type="button"
                  onClick={() => editClick(feedback)}
                >🖉</button>
              </label>
            ))}
          </>
        )}
        <section className={tyl.newGroup}>
          {uuid && <input type="hidden" id="uuid" value={uuid}/>}
          <input
            id="title"
            required
            placeholder="Title"
            value={title ?? ''}
            onChange={({ target: { value } }) => setTitle(value)}
          />
          <input
            id="description"
            className={tyl.description}
            placeholder="Description"
            value={description ?? ''}
            onChange={({ target: { value } }) => (
              setDescription(value)
            )}
          />
          <button>{uuid ? 'Update' : 'Create'} Group</button>
          <button
            type="button"
            onClick={resetForm}
          >Cancel</button>
          {uuid && (
            <button
              type="button"
              onClick={() => deleteGroup(uuid)}
            >Delete Group</button>
          )}
        </section>
      </form>
    </section>
  )
}

export default FeedbackGroups