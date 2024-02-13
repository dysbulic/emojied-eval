import { HTMLAttributes, MouseEvent, Ref, forwardRef } from "react"
import useSupabase from "../../lib/useSupabase"
import { useQuery } from '@tanstack/react-query'
import { image } from '../../lib/utils'
import tyl from './index.module.css'
import { Point } from "../Reactor"

export type Reaction = {
  image?: string
}

export const ReactionDialog = forwardRef(
  (
    {
      groupId,
      onReactionSelect,
      onClose,
      center,
      ...props
    }: {
      groupId: string
      onReactionSelect: (
        reaction: Reaction, evt: MouseEvent<HTMLButtonElement>
      ) => void
      onClose?: () => void
      center?: Point
    } & HTMLAttributes<HTMLDialogElement>,
    dialog: Ref<HTMLDialogElement>,
  ) => {
    const { supabase, error: supaError } = useSupabase()
    if(supaError) throw supaError

    const {
      /* isLoading: loading, */ error: feedbacksError, data: feedbacks,
    } = useQuery({
      queryKey: ['ReactionForm', { uuid: groupId, supabase }],
      queryFn: async () => {
        if(!supabase) throw new Error('Supabase not initialized.')
        let query = (
          supabase?.from('feedbacks_groups')
          .select('*, feedbacks( image )')
        )
        if(groupId){
          query = query.eq('group_id', groupId)
        }
        const { data, error } = (
          await query
        ) ?? {}
        if(error) throw error 
        return data
      },
      enabled: !!supabase,
      // suspense: true,
    })
    if(feedbacksError) throw feedbacksError

    const onClick=(evt: MouseEvent<HTMLButtonElement>) => {
      const button = evt.currentTarget as HTMLButtonElement
      onReactionSelect?.({ image: button.dataset.image }, evt)
      onClose?.()
    }

    const pos = { top: '0', left: '0' }
    if(center && !(dialog instanceof Function) && dialog?.current) {
      const parent = dialog.current.parentElement
      if(parent) {
        const box = {
          width: (
            dialog.current.clientWidth / parent.clientWidth * 100
          ),
          height: (
            dialog.current.clientHeight / parent.clientHeight * 100
          ),
        }
        pos.left = `${Math.max(0, center.x - box.width / 2)}%`
        pos.top = `${center.y - box.height / 2}%`
      }
    }

    return (
      <dialog
        className={tyl.dialog}
        ref={dialog}
        style={{ ...pos }}
        {...props}
      >
        <form
          className={tyl.form}
          onSubmit={(evt) => evt.preventDefault()}
        >
          {feedbacks?.map((fb) => (
            <button
              key={fb.id}
              data-image={fb.feedbacks.image}
              {...{ onClick }}
            >
              {image(fb.feedbacks.image)}
            </button>
          ))}
        </form>
      </dialog>
    )
  }
)

export default ReactionDialog