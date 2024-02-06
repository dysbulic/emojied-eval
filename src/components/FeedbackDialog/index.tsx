import { FormEvent, forwardRef, useRef } from 'react'
import { useSupabase } from '../../lib/useSupabase'
import formtyl from '../../styles/form.module.css'

interface FormElements extends HTMLFormControlsCollection {
  image: HTMLInputElement,
  name: HTMLInputElement,
  description: HTMLInputElement,
}

export type Props = {
  onClose: () => void
  className?: string
}

export const FeedbackDialog = forwardRef<HTMLDialogElement, Props>(
  ({ onClose, className }, ref) => {
    const form = useRef<HTMLFormElement>(null)
    const { supabase } = useSupabase()
    const close = () => {
      onClose?.()
      if(!(ref instanceof Function)) {
        ref?.current?.close()
      }
      form.current?.reset() 
    }
    const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
      if(!supabase) throw new Error('Supabase not defined.')
      const elements = evt.currentTarget.elements as FormElements
      await supabase.from('feedbacks').insert({
        image: elements.image.value,
        name: elements.name.value,
        description: elements.description.value,
      })
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
          <label>
            <h3>Image</h3>
            <input id="image" required/>
          </label>
          <label>
            <h3>Name</h3>
            <input id="name" required/>
          </label>
          <label>
            <h3>Description</h3>
            <textarea id="description">
            </textarea>
          </label>
          <section className={formtyl.buttons}>
            <button
              className={formtyl.cancel}
              onClick={onClose}
            >Cancel</button>
            <button className={formtyl.submit}>Create</button>
          </section>
        </form>
      </dialog>
    )
  }
)

export default FeedbackDialog