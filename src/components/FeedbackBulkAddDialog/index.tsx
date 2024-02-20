import { FormEvent, forwardRef, useRef, /* useState */ } from 'react'
import { useSupabase } from '../../lib/useSupabase'
import { Feedback } from '../ReactionSelector'
import { Link } from 'react-router-dom';
import tyl from './index.module.css'
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

export type Maybe<T> = T | undefined

export const FeedbackBulkAddDialog = forwardRef<HTMLDialogElement, Props>(
  ({ feedback, onClose, className }, dialog) => {
    // const [text, setText] = useState<Maybe<string>>()
    const form = useRef<HTMLFormElement>(null)
    const { supabase } = useSupabase()

    const close = () => {
      onClose?.()
      if(!(dialog instanceof Function)) {
        dialog?.current?.close()
      }
      form.current?.reset()
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
      <dialog {...{ className }} ref={dialog}>
        <form
          method="dialog"
          className={tyl.form}
          ref={form}
          {...{ onSubmit }}
        >
          <h2>Bulk Add Feedbacks</h2>
          <aside id={tyl.instructions}>
            <p>
              Format may either be{' '}
              <Link
                to=""
                title="JavaScript Object Notation v5"
              >JSON5 Array</Link>, or{' '}
              <Link
                to=""
                title="Comma Separated Values"
              >headered CSV</Link>.
            </p>
            <p>
              The headers / keys are:
              <ul>
                <li><code>image-url</code></li>
                <li><code>name</code></li>
                <li><code>feedback-group-ids</code></li>
                <li><code>description</code></li>
              </ul>
            </p>
          </aside>
          <textarea
            id="text"
            placeholder={`image-url, name, feedback-group-ids, description
https://code.trwb.live/logo.svg, Swirling Mobster, , ¡Mama Mia!: ¡Look at it!
https://trwb.live/logo.svg, The Big T, , "It's a bigun!"`}
          />
          <section className={formtyl.buttons}>
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

export default FeedbackBulkAddDialog