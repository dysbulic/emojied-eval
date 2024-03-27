import {
  of, groupBy, lastValueFrom, map, mergeMap, reduce, toArray,
} from 'rxjs'
import { forwardRef, useCallback, useEffect, MouseEvent } from 'react';
import { useQuery } from '@tanstack/react-query'
import useSupabase from '../../lib/useSupabase'
import { emoji } from '../../lib/utils';
import tyl from './index.module.css'
import { Maybe } from '../FeedbackBulkAddDialog';

export type Feedback = {
  id: string
  image: string
  name: string
  description: string
}
export type FeedbackGroup = {
  id: Maybe<string>
  title: string
  feedbacks?: Array<Feedback | undefined>
}

export type Props = {
  onSelect?: (
    reaction: Feedback, evt: MouseEvent<HTMLButtonElement>
  ) => void
  feedbackGroupIds?: Array<string>
}

class NotFoundError extends Error {}

export const ReactionSelector = (
  forwardRef<HTMLDialogElement, Props>(
    ({ onSelect, feedbackGroupIds }, dialog) => {
      const { supabase } = useSupabase()
      const { data: groups, error, isLoading: loading } = useQuery({
        enabled: !!supabase && !!feedbackGroupIds,
        queryKey: ['Reactions', { supabase }],
        queryFn: async () => {
          if(!supabase) throw new Error('`supabase` not defined.')
          if(
            feedbackGroupIds
            && feedbackGroupIds.filter((g) => !!g).length > 0
          ) {
            const { data: feedbacks } = (
              await supabase?.from(`feedbacks_groups`)
              .select(`
                feedback_groups (id, title),
                feedbacks (id, image, name, description)
              `)
              .in('group_id', feedbackGroupIds)
            ) ?? { data: [] }
            const groups$ = (
              of(...(feedbacks ?? []))
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
          } else {
            const { data: feedbacks } = (
              await supabase?.from(`feedbacks`)
              .select('id, image, name, description')
            ) ?? { data: [] }
            return [{
              id: null,
              title: 'Reactions',
              feedbacks: feedbacks ?? [],
            }]
          }
        },
      })
      if(error) throw error

      const findFocused = useCallback(() => {
        const focused = document.activeElement
        if(!focused) {
          throw new Error('No focused element defined.')
        }
        if(focused instanceof HTMLButtonElement) {
          for(const [gIdx, group] of groups?.entries() ?? []) {
            for(const [fbIdx, fb] of group.feedbacks.entries()) {
              if(focused.id === `${group.id}-${fb?.id}`) {
                return { gIdx, fbIdx, focused }
              }
            }
          }
        }
        throw new NotFoundError('No focused element found.')
      }, [groups])

      const focus = useCallback(
        (idx: { group: number, feedback: number }) => {
          if(!groups) throw new Error('No groups defined.')

          const id = {
            group: groups[idx.group].id,
            feedback: groups[idx.group].feedbacks[idx.feedback]?.id,
          }
          if(id) {
            const next = document.getElementById(
              `${id.group}-${id.feedback}`
            )
            next?.focus()
          }
        },
        [groups],
      )

      const listen = useCallback((evt: KeyboardEvent) => {
        if(!groups) throw new Error('No groups defined.')

        const max = {
          group: groups.length - 1,
          feedback: groups[groups.length - 1].feedbacks.length - 1,
        }

        switch(evt.key) {
          case 'ArrowLeft': {
            try {
              const { gIdx = 0, fbIdx = 0 } = findFocused() ?? {}
              const idx = { group: gIdx, feedback: fbIdx }
              if(fbIdx === 0 && gIdx > 0) {
                --idx.group
                idx.feedback = groups[idx.group].feedbacks.length - 1
              } else if(fbIdx > 0) {
                --idx.feedback
              }
              focus(idx)
            } catch(err) {
              if(err instanceof NotFoundError) {
                focus(max)
              } else {
                throw err
              }
            }
            break
          }
          case 'ArrowRight': {
            try {
              const { gIdx, fbIdx } = findFocused() ?? {}
              const idx = { group: gIdx, feedback: fbIdx }
              max.feedback = groups[gIdx].feedbacks.length - 1
              if(fbIdx >= max.feedback && gIdx < max.group) {
                ++idx.group
                idx.feedback = 0
              } else if(fbIdx < max.feedback) {
                ++idx.feedback
              }
              focus(idx)
            } catch(err) {
              if(err instanceof NotFoundError) {
                focus({ group: 0, feedback: 0 })
              } else {
                throw err
              }
            }
            break
          }
          case 'ArrowUp': {
            try {
              const { focused } = findFocused() ?? {}
              const buttons = (
                document
                .querySelectorAll<HTMLButtonElement>('.reaction')
              )
              const inline = Array.from(buttons).filter(
                (btn) => (
                  btn.offsetLeft === focused.offsetLeft
                  && btn.id !== focused.id
                )
              )
              let nearest = inline[0]
              for(let i = 1; i < inline.length; i++) {
                const Δ = {
                  candidate: focused.offsetTop - inline[i].offsetTop,
                  current: focused.offsetTop - nearest.offsetTop,
                }
                if(
                  Δ.current < 0
                  || (Δ.candidate < Δ.current && Δ.candidate >= 0)
                ) {
                  nearest = inline[i]
                }
              }
              nearest.focus()
            } catch(err) {
              if(err instanceof NotFoundError) {
                focus({ group: 0, feedback: 0 })
              } else {
                throw err
              }
            }
            break
          }
          case 'ArrowDown': {
            try {
              const { focused } = findFocused() ?? {}
              const buttons = (
                document
                .querySelectorAll<HTMLButtonElement>('.reaction')
              )
              const inline = Array.from(buttons).filter(
                (btn) => (
                  btn.offsetLeft === focused.offsetLeft
                  && btn.id !== focused.id
                )
              )
              let nearest = inline[0]
              for(let i = 1; i < inline.length; i++) {
                const Δ = {
                  candidate: focused.offsetTop - inline[i].offsetTop,
                  current: focused.offsetTop - nearest.offsetTop,
                }
                if(
                  Δ.current > 0
                  || (Δ.candidate > Δ.current && Δ.candidate <= 0)
                ) {
                  nearest = inline[i]
                }
              }
              nearest.focus()
            } catch(err) {
              if(err instanceof NotFoundError) {
                focus(max)
              } else {
                throw err
              }
            }
            break
          }
          default: { null }
        }
      }, [findFocused, focus, groups])

      useEffect(() => {
        const capture = listen
        document.addEventListener('keydown', capture)
        return () => document.removeEventListener('keydown', capture)
      }, [listen])

      return (
        <dialog className={tyl.dialog} ref={dialog}>
          <form method="dialog">
            {loading ? <p>Loading…</p> : (
              groups?.map((group: FeedbackGroup | null, idx) => (
                <section key={idx} className={tyl.fbGroup}>
                  <header><h2>{group?.title}</h2></header>
                  <main>
                    {group?.feedbacks?.map((fb?: Feedback) => (
                      (fb && (
                        <button
                          key={fb.id}
                          id={`${group.id ?? idx}-${fb.id}`}
                          className="reaction"
                          onClick={(evt) => onSelect?.(fb, evt)}
                        >
                          {emoji(fb.image)}
                        </button>
                      ))
                    ))}
                  </main>
                </section>
              ))
            )}
          </form>
        </dialog>
      )
    }
  )
)

export default ReactionSelector