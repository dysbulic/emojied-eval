import { useQuery } from '@tanstack/react-query'
import { FormEvent, useContext, useEffect, useState } from 'react'
import Header from '../Header'
import { ConfigContext } from '../../lib/ConfigContext'
import useSupabase from '../../lib/useSupabase'
import { Maybe } from '../FeedbackBulkAddDialog'
import tyl from './index.module.css'

export const Configuration = () => {
  const { setConfigProp, config } = useContext(ConfigContext)
  const [pfp, setPfP] = useState<Maybe<string>>()
  const { supabase } = useSupabase()
  const { data: { image: pic = null } = {}, error, refetch } = (
    useQuery<unknown, unknown, { image: Maybe<string> }>({
      enabled: !!supabase,
      queryKey: ['pfp'],
      queryFn: async () => {
        if(!supabase) throw new Error('`supabase` not defined.')
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) throw new Error('`user` not set.')
        const { data } = (
          await supabase.from('userinfo')
          .select('image')
          .eq('user_id', user.id)
          .single()
        )
        return data
      }
    })
  )
  if(error) throw error

  useEffect(() => {
    setPfP(pic)
  }, [pic])

  const savePfP = async (evt: FormEvent) => {
    evt.preventDefault()
    if(!supabase) throw new Error('`supabase` not defined.')
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) throw new Error('`user` not set.')
    const { error } = (
      await supabase.from('userinfo')
      .update({ image: pfp })
      .eq('user_id', user.id)
      .select()
      .single()
    )
    if(error) throw error
    refetch()
  }

  console.debug({ pic })

  return (
    <article>
      <Header>
        <h1>Configuration</h1>
      </Header>
      <form className={tyl.form}>
        <label>
          <h3>Emoji Size</h3>
          <input
            type="range"
            min="1"
            max="7"
            step="0.5"
            value={Number(config.emojiSize.replace(/[^\d.]/g, ''))}
            title={config.emojiSize}
            onChange={(e) => {
              setConfigProp('emojiSize', `${e.target.value}rem`)
            }}
          />rem
          <output className="emoji">😺</output>
        </label>
      </form>
      <form className={tyl.lineInput} onSubmit={savePfP}>
        <label className={tyl.lineInput}>
          <h3>Profile Picture</h3>
          <input
            value={pfp ?? ''}
            onChange={({ target: { value } }) => (
              setPfP(value)
            )}
          />
        </label>
        <button disabled={!pfp || pic === pfp}>Save</button>
        {pfp && <img className="emoji"  src={pfp}/>}
      </form>
    </article>
  )
}

export default Configuration