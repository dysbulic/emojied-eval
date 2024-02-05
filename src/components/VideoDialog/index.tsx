import {
  FormEvent, useCallback, useEffect, useRef, forwardRef, ForwardedRef
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../../lib/useSupabase'
import tyl from './index.module.css'
import { Video } from '../Videos'

interface FormElements extends HTMLFormControlsCollection {
  url: HTMLInputElement
  title: HTMLInputElement
  description: HTMLInputElement
  group: HTMLSelectElement
}

type Maybe<T> = T | null | undefined

export const VideoDialog = forwardRef(
  (
    { video, onClose }:
    { video?: Maybe<Video>, onClose?: () => void },
    dialog: ForwardedRef<HTMLDialogElement>,
  ) => {
    const { supabase } = useSupabase()
    const form = useRef<HTMLFormElement>(null)
    const close = useCallback(() => {
      form.current?.reset()
      if(!(dialog instanceof Function)) {
        dialog?.current?.close()
      }
      onClose?.()
    }, [dialog, onClose])

    useEffect(() => {
      if(!(dialog instanceof Function)) {
        const listen = close
        const dia = dialog?.current
        dia?.addEventListener('close', listen)
        return () => dia?.removeEventListener('close', listen)
      }
    }, [close, dialog])

    const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
      if(!supabase) throw new Error('Supabase not defined.')
      const elements = evt.currentTarget.elements as FormElements
      const values = {
        url: elements.url.value,
        title: elements.title.value,
        description: elements.description.value,
        feedback_group_id: elements.group.value || null,
      }
      if(video) {
        await supabase.from('videos').update(values).eq('id', video.id)
      } else {
        await supabase.from('videos').insert(values)
      }
      close()
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

    return (
      <dialog
        ref={dialog}
        className={tyl.dialog}
      >
        <form
          {...{ onSubmit }}
          method="dialog"
          className={tyl.form}
          ref={form}
        >
          <label>
            <h3>URL</h3>
            <input id="url" defaultValue={video?.url} required/>
          </label>
          <label>
            <h3>Title</h3>
            <input id="title" defaultValue={video?.title} required/>
          </label>
          <label>
            <h3>Description</h3>
            <textarea id="description" defaultValue={video?.description ?? ''}>
            </textarea>
          </label>
          <label>
            <h3>Feedback Group</h3>
            {loading ? <p>Loading…</p> : (
              <select id="group" defaultValue={video?.feedback_group_id}>
                <option value="" className={tyl.noneOption}>None</option>
                {groups?.map((group) => (
                  <option key={group.id} value={group.id}>{group.title}</option>
                ))}
              </select>
            )}
          </label>
          <div className={tyl.buttons}>
            <button type="button" onClick={close}>Cancel</button>
            <button>{video ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </dialog>
    )
  }
)

export default VideoDialog