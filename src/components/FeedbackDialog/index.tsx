import { FormEvent, forwardRef, useEffect, useRef, useState } from 'react'
import { useSupabase } from '../../lib/useSupabase'
import { Feedback } from '../ReactionSelector'
import { emoji } from '../../lib/utils';
import formtyl from '../../styles/form.module.css'

interface FormElements extends HTMLFormControlsCollection {
  id: HTMLInputElement
  image: HTMLInputElement
  name: HTMLInputElement
  description: HTMLInputElement
}

export type Props = {
  feedback?: Feedback
  onClose: () => void
  className?: string
}

type Maybe<T> = T | undefined

export const FeedbackDialog = forwardRef<HTMLDialogElement, Props>(
  ({ feedback, onClose, className }, ref) => {
    const [name, setName] = useState<Maybe<string>>(feedback?.name)
    const [image, setImage] = useState<Maybe<string>>(feedback?.image)
    const [description, setDescription] = (
      useState<Maybe<string>>(feedback?.description)
    )
    const form = useRef<HTMLFormElement>(null)
    const { supabase } = useSupabase()

    useEffect(() => {
      setName(feedback?.name)
      setImage(feedback?.image)
      setDescription(feedback?.description)
    }, [feedback])

    const close = () => {
      setName(undefined)
      setImage(undefined)
      setDescription(undefined)
      onClose?.()
      if(!(ref instanceof Function)) {
        ref?.current?.close()
      }
    }
    const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
      if(!supabase) throw new Error('Supabase not defined.')
      const elements = evt.currentTarget.elements as FormElements
      const values = {
        image: elements.image.value,
        name: elements.name.value,
        description: elements.description.value,
        id: elements.id?.value || undefined,
      }
      await supabase.from('feedbacks').upsert(values)
      close()
    }

    return (
      <dialog {...{ ref, className }}>
        <form
          method="dialog"
          className={formtyl.form}
          ref={form}
          {...{ onSubmit }}
        >
          {feedback?.id && (
            <input type="hidden" name="id" value={feedback.id}/>
          )}
          <label>
            <h3>Image</h3>
            <input
              id="image"
              required
              value={image ?? ''}
              onChange={({ target: { value } }) => (
                setImage(value)
              )}
            />
          </label>
          <label>
            <h3>Name</h3>
            <input
              id="name"
              required
              value={name ?? ''}
              onChange={({ target: { value } }) => (
                setName(value)
              )}
            />
          </label>
          <label>
            <h3>Description</h3>
            <textarea
              id="description"
              value={description ?? ''}
              onChange={({ target: { value } }) => (
                setDescription(value)
              )}
            />
          </label>
          {image && (
            emoji(image, { className: formtyl.center })
          )}
          <section className={`${formtyl.buttons} ${formtyl.full}`}>
            <button
              type="button"
              className={formtyl.cancel}
              onClick={close}
            >Cancel</button>
            <button className={formtyl.submit}>
              {feedback ? 'Update' : 'Create'}
            </button>
          </section>
        </form>
      </dialog>
    )
  }
)

export default FeedbackDialog