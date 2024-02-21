import { ReactNode, Ref, forwardRef } from 'react'
import formtyl from '../../styles/form.module.css'

export const DisplayDialog = forwardRef(
  (
    { children }: { children: ReactNode },
    dialog: Ref<HTMLDialogElement>,
  ) => {
    return (
      <dialog ref={dialog}>
        {children}
        <form method="dialog" className={formtyl.buttons}>
          <button>Close</button>
        </form>
      </dialog>
    )
  }
)

export default DisplayDialog