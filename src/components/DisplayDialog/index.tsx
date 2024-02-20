import { ReactNode, Ref, forwardRef } from "react"

export const DisplayDialog = forwardRef(
  (
    { children }: { children: ReactNode },
    dialog: Ref<HTMLDialogElement>,
  ) => {
    return (
      <dialog ref={dialog}>
        {children}
      </dialog>
    )
  }
)

export default DisplayDialog