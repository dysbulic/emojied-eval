import useSupabase from "../../lib/useSupabase"
import { useQuery } from '@tanstack/react-query'
import { image } from '../../lib/utils'
import tyl from './index.module.css'

export type Reaction = {
  image?: string
}

export const ReactionForm = ({
  groupId,
  visible = true,
  onReactionSelect,
  onClose,
  ...props
}: {
  groupId: string
  visible: boolean
  onReactionSelect: (reaction: Reaction, evt: PointerEvent) => void
  onClose: () => void
}) => {

  const { supabase, error: supaError } = useSupabase()
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
  const onClick=(evt: PointerEvent) => {
    onReactionSelect?.({ image: evt.target?.dataset.image }, evt)
  }

console.debug({ feedbacks })
  return (
    <dialog className={tyl.form} {...props}>
      {feedbacks?.map((fb) => (
        <button key={fb.id} data-image={fb.feedbacks.image} {...{ onClick }}>
          {image(fb.feedbacks.image)}
        </button>
      ))}
    </dialog>
  )
} 

export default ReactionForm

