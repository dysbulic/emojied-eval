import { HTMLAttributes, MouseEvent } from "react"
import useSupabase from "../../lib/useSupabase"
import { useQuery } from '@tanstack/react-query'
import { image } from '../../lib/utils'
import tyl from './index.module.css'

export type Reaction = {
  image?: string
}

export const ReactionDialog = ({
  groupId,
  onReactionSelect,
  onClose,
  ...props
}: {
  groupId: string
  onReactionSelect: (
    reaction: Reaction, evt: MouseEvent<HTMLButtonElement>
  ) => void
  onClose?: () => void
} & HTMLAttributes<HTMLDialogElement>) => {
  const { supabase, error: supaError } = useSupabase()
  if(supaError) throw supaError

  const {
    /* isLoading: loading, */ error: feedbacksError, data: feedbacks,
  } = useQuery({
    queryKey: ['ReactionForm', { uuid: groupId, supabase }],
    queryFn: async () => {
      if(!supabase) throw new Error('Supabase not initialized.')
      if(groupId){
        const { data, error } = (
          await supabase?.from('feedbacks_groups')
          .select('*, feedbacks( image )')
          .eq('group_id', groupId)
        ) ?? {}
        if(error) throw error 
        return data
      }
      throw new Error('videoConfig is undefined')
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

  return (
    <dialog className={tyl.form} {...props}>
      {feedbacks?.map((fb) => (
        <button
          key={fb.id}
          data-image={fb.feedbacks.image}
          {...{ onClick }}
        >
          {image(fb.feedbacks.image)}
        </button>
      ))}
    </dialog>
  )
} 

export default ReactionDialog