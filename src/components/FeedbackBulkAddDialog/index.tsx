import { FormEvent, forwardRef, useRef, /* useState */ } from 'react'
import JSON5 from 'json5'
import { useSupabase } from '../../lib/useSupabase'
import { Feedback } from '../ReactionSelector'
import { Link } from 'react-router-dom'
import Papa from 'papaparse'
import tyl from './index.module.css'
import formtyl from '../../styles/form.module.css'

interface FormElements extends HTMLFormControlsCollection {
  text: HTMLTextAreaElement
}

export type Props = {
  feedback?: Feedback
  onClose: () => void
  className?: string
}

export type Maybe<T> = T | undefined | null

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
      const text = elements.text.value.trim()
      const values = (text.startsWith('[') ? (
        JSON5.parse(text)
      ) : (
        Papa.parse(text, { header: true }).data
      ))
      console.debug({ values })
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
                to="https://json5.org"
                title="JavaScript Object Notation v5"
              >JSON5 Array</Link>, or{' '}
              <Link
                to="https://en.wikipedia.org/wiki/Comma-separated_values"
                title="Comma Separated Values"
              >headered CSV</Link>.
            </p>
            <p>The headers / keys are:</p>
            <ul>
              <li><code>image</code> <em>(may be a URL or emoji)</em></li>
              <li><code>name</code></li>
              <li><code>description</code></li>
            </ul>
          </aside>
          <textarea
            id="text"
            placeholder={`image,name,description
https://code.trwb.live/logo.svg,Swirling Mobster,¡Mama Mia!: ¡Look at it!
https://trwb.live/logo.svg,The Big T,"It's a bigun!"
                       or
[
  {
    image: 'https://code.trwb.live/logo.svg ',
    name: 'Swirling Mobster',
    description: '¡Mama Mia!: ¡Look at it!',
  },
  {
    image: 'https://trwb.live/logo.svg',
    name: 'The Big T',
    description: "It's a bigun!",
  },
]`}
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