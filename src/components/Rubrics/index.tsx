import { FormEvent, useEffect, useState } from 'react'
import useSupabase from '../../lib/useSupabase'
import { useFeedbacks } from '../FeedbackGroups/queries'
import { useRubrics, useWeights } from '../WeightedReactions/queries'
import { Rubric } from '../WeightedReactions'
import { Maybe } from '../FeedbackBulkAddDialog'
import { emoji } from '../../lib/utils'
import tyl from './index.module.css'
import formtyl from '../../styles/form.module.css'
import Header from '../Header'
import { Link } from 'react-router-dom'

interface FormElements extends HTMLFormControlsCollection {
  defaultWeight: HTMLInputElement
  name: HTMLInputElement
}

export const Rubrics = () => {
  const { supabase } = useSupabase()
  const { data: rubrics, refetch: refetchRubrics } = (
    useRubrics(supabase)
  )
  const { data: feedbacks } = useFeedbacks(supabase)
  const [rubric, setRubric] = useState<Maybe<Rubric>>()
  const { data: weightInfo } = useWeights(supabase, rubric)
  const [weights, setWeights] = useState(weightInfo)
  const [name, setName] = useState<Maybe<string>>()
  const [defaultWeight, setDefaultWeight] = (
    useState<Maybe<number>>()
  )

  useEffect(() => {
    setWeights(weightInfo)
  }, [weightInfo])

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const elements = evt.currentTarget.elements as FormElements
    const defaultWeight = Number(elements.defaultWeight.value)

    const { data: newRubric } = (
      await supabase?.from('rubrics')
      .upsert({
        id: rubric?.id,
        name: elements.name.value,
        default_weight: defaultWeight,
      })
      .select()
      .single()
    ) ?? {}

    const weights: Array<{
      feedback_id: string
      weight: number
      rubric_id: string
    }> = []
    Array.from(elements).forEach((elem) => {
      const { id, value } = elem as HTMLInputElement
      const weight = Number(value)
      if(id.startsWith('weight-') && weight !== defaultWeight) {
        weights.push({
          rubric_id: newRubric?.id,
          feedback_id: id.replace(/^weight-/, ''),
          weight,
        })
      }
    })

    await supabase?.from('feedbacks_weights')
    .delete()
    .eq('rubric_id', rubric?.id)

    await supabase?.from('feedbacks_weights')
    .insert(weights)

    refetchRubrics()
  }

  const resetForm = () => {
    setRubric(null)
    setName(null)
    setDefaultWeight(null)
    setWeights({})
  }

  const deleteRubric = async (id: string) => {
    await supabase?.from('rubrics')
    .delete()
    .eq('id', id)

    refetchRubrics()
  }

  console.debug({ rubric, weightInfo, weights })

  return (
    <section id={tyl.rubrics}>
      <Header><h1>Rubrics</h1></Header>
      {!feedbacks || feedbacks.length === 0 && (
        <>
          <p>
            This area is for assigning scoring weights to reactions.{' '}
            No reactions have been created yet.
          </p>
          <Link to="/reactions" className="button">
            Create Reactions
          </Link>
        </>
      )}
      {rubrics && rubrics.length > 0 && (
        <form className={`${formtyl.buttons} ${tyl.load}`}>
          <select
            id="rubrics"
            value={rubric?.id ?? ''}
            onChange={({ target: { value } }) => {
              const rubric = rubrics?.find(
                ({ id }) => id === value
              )
              setName(rubric?.name)
              setDefaultWeight(rubric?.default_weight)
              setRubric(rubric)
            }}
          >
            <option value="">Load a Rubric</option>
            {rubrics?.map(
              ({ id, name }: { id: string, name: string }) => (
                <option key={id} value={id}>{name}</option>
              )
            )}
          </select>
          <button
            className={formtyl.delete}
            disabled={!rubric}
            type="button"
            onClick={() => {
              if(rubric) {
                deleteRubric(rubric.id)
                resetForm()
              }
            }}
          >🗑 Delete</button>
          <button
            className={formtyl.reset}
            type="button"
            onClick={resetForm}
          >Reset</button>
        </form>
      )}
      <form {...{ onSubmit }}>
        <ul className={tyl.table}>
          {feedbacks?.map(({ id, name, image }) => {
            const weight = weights?.[id] ?? defaultWeight ?? 0

            return (
              <li key={id}>
                {emoji(image)}
                <h2>{name}</h2>
                <input
                  id={`weight-${id}`}
                  className={
                    weights && id in weights ? tyl.has : tyl.default
                  }
                  type="number"
                  value={weight}
                  onChange={({ target: { value } }) => {
                    setWeights((prev: Record<string, number>) => ({
                      ...prev,
                      [id]: Number(value),
                    }))
                  }}
                />
              </li>
            )
          })}
        </ul>
        <div className={formtyl.buttons}>
          <input
            id="name"
            placeholder="Name"
            value={name ?? ''}
            onChange={({ target: { value } }) => {
              setName(value)
            }}
            required
          />
          <input
            id="defaultWeight"
            placeholder="Default Weight"
            type="number"
            value={defaultWeight ?? ''}
            onChange={({ target: { value } }) => {
              setDefaultWeight(Number(value))
            }}
          />
          <button className={formtyl.add}>
            {rubric ? 'Update' : 'Create'} Rubric
          </button>
        </div>
      </form>
    </section>
  )
}