import {
  of, groupBy, lastValueFrom, map, mergeMap, reduce, toArray,
} from 'rxjs'
import { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import useSupabase from '../../lib/useSupabase'
import { image } from '../../lib/utils';
import tyl from './index.module.css'

export type Feedback = {
  id: string
  image: string
  name: string
  description: string
}
export type FeedbackGroup = {
  id: string
  title: string
  feedbacks?: Array<Feedback | undefined>
}


export const ReactionSelector = (
  { onReactionSelect, feedbackGroupIds }: {
    onReactionSelect?: (reaction: string) => void
    feedbackGroupIds?: Array<string>
  }
) => {
  const { supabase } = useSupabase()
  const { data: groups, error, isLoading: loading } = useQuery({
    queryKey: ['Reactions', { supabase }],
    queryFn: async () => {
      let query = (
        supabase?.from(`feedbacks_groups`)
        .select(`
          id,
          feedback_groups (id, title),
          feedbacks (id, image, name, description)
        `)
      )
      if(feedbackGroupIds) {
        query = query?.in('group_id', feedbackGroupIds)
      }
      const { data: feedbacks } = await query ?? {}
      if(feedbacks) {
        const groups$ = (
          of(...feedbacks)
          .pipe(
            groupBy(
              ({ feedback_groups: group }) => {
                const { title } = Array.isArray(group) ? group[0] : group
                return title
              },
              { element: (
                { feedbacks, feedback_groups: group }
              ) => {
                const { id } = Array.isArray(group) ? group[0] : group
                return ({ id, feedbacks })
              } },
            ),
            mergeMap((group$) => group$.pipe(
              reduce(
                (acc: Array<unknown>, cur) => [...acc, cur],
                [String(group$.key)],
              ),
            )),
            map(([title, ...data]) => {
              const feedbacks = (
                (data as Array<FeedbackGroup>)
                .map(({ feedbacks }) => feedbacks)
                .flat()
              )
              const { id } = (data as Array<{ id: string }>)[0]
              return { id, title: title as string, feedbacks }
            }),
            toArray(),
          )
        )
        return lastValueFrom(groups$)
      }
    },
    enabled: !!supabase,
  })
  if(error) throw error

  const onSubmit = async (
    evt: FormEvent<HTMLFormElement>
  ) => {
    evt.currentTarget
    onReactionSelect?.('w')
    return null
  }

  return (
    <dialog open>
      <form method="dialog" {...{ onSubmit }}>
        {loading ? <p>Loading…</p> : (
          groups?.map((group: FeedbackGroup) => (
            <section key={group.id} className={tyl.fbGroup}>
              <header><h2>{group.title}</h2></header>
              <main>
                {group.feedbacks?.map((fb?: Feedback) => (
                  fb && (
                    <button id={fb.id} key={fb.id}>
                      {image(fb.image)}
                    </button>
                  )
                ))}
              </main>
            </section>
          ))
        )}
      </form>
    </dialog>
  )
}

export default ReactionSelector