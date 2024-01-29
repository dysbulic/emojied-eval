import { useQuery } from '@tanstack/react-query'
import useSupabase from '../../lib/useSupabase'
import { image } from '../../lib/utils'

export const FeedbackGroups = () => {
  const { supabase } = useSupabase()
  const { data: feedbacks } = useQuery({
    queryKey: ['FeedbackGroups', { supabase }],
    queryFn: async() => {
      const { data } = (
        await supabase?.from('feedbacks')
        .select()
      )
      return data
    },
    enabled: !!supabase,
  })

  return (
    <section>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.id}>
            {image(feedback.image)}
            <h2>{feedback.title}</h2>
            <div>{feedback.description}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default FeedbackGroups