import { useContext } from 'react'
import Header from '../Header'
import { ConfigContext } from '../../lib/ConfigContext'
import tyl from './index.module.css'

export const Configuration = () => {
  const { setConfigProp, config } = useContext(ConfigContext)

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
            max="5"
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
    </article>
  )
}

export default Configuration