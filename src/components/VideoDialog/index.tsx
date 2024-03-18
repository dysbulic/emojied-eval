import {
  type FormEvent, useCallback, useEffect, useRef,
  forwardRef, type ForwardedRef, useState,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../../lib/useSupabase'
import type { Video } from '../Videos'
import tyl from './index.module.css'
import formtyl from '../../styles/form.module.css'

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
    const [fbGroup, setFbGroup] = useState<Maybe<string>>()
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
      const values: Video = {
        id: video?.id,
        url: elements.url.value,
        title: elements.title.value,
        description: elements.description.value,
      }
      const videoElem = document.createElement('video') as HTMLVideoElement
      values.duration = await new Promise<Maybe<string>>((resolve) => {
        videoElem.addEventListener('loadedmetadata', () => {
          resolve(
            new Date(videoElem.duration * 1000)
            .toISOString()
            .split('T').at(-1)
            ?.replace(/\w$/g, '') ?? null
          )
        } )
        videoElem.src = values.url
      })
      const { data: vid, error } = (
        await supabase.from('videos')
        .upsert(values)
        .select('id')
        .single()
      ) ?? {}
      if(error) throw error
      const fb_group = elements.group.value

      await supabase.from('feedback_groups_videos')
      .delete()
      .eq('video_id', vid.id)

      if(fb_group) {
        await supabase.from('feedback_groups_videos')
        .upsert({
          video_id: vid.id,
          group_id: fb_group,
        })
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

    const fbg = video?.feedback_groups?.[0]?.id
    useEffect(() => {
      console.debug({ fbg })
      setFbGroup(fbg)
    }, [fbg])

    return (
      <dialog
        ref={dialog}
        className={tyl.dialog}
      >
        <form
          {...{ onSubmit }}
          method="dialog"
          className={formtyl.form}
          ref={form}
        >
          <label>
            <h3>URL</h3>
            <input
              id="url"
              defaultValue={video?.url ?? ''}
              required
            />
          </label>
          <label>
            <h3>Title</h3>
            <input
              id="title"
              defaultValue={video?.title ?? ''}
              required
            />
          </label>
          <label>
            <h3>Description</h3>
            <textarea
              id="description"
              defaultValue={video?.description ?? ''}
            >
            </textarea>
          </label>
          <label>
            <h3 className={tyl.split}>Feedback Group</h3>
            {loading ? <p>Loading…</p> : (
              <select
                id="group"
                value={fbGroup ?? ''}
                onChange={({ currentTarget: { value } }) => (
                  setFbGroup(value)
                )}
              >
                <option value="" className={tyl.noneOption}>None</option>
                {groups?.map((group) => (
                  <option
                    key={group.id}
                    value={group.id}
                  >{group.title}</option>
                ))}
              </select>
            )}
          </label>
          <div className={`${formtyl.buttons} gridfull`}>
            <button
              type="button"
              onClick={close}
              className={formtyl.cancel}
            >Cancel</button>
            <button className={formtyl.submit}>
              {video ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </dialog>
    )
  }
)

export default VideoDialog