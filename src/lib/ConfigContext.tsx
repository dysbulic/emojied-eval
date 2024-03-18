import { createContext, useState, ReactNode } from 'react';


export const defaultConfig = {
  emojiSize: '2rem',
}

export type ConfigContextType = {
  config: typeof defaultConfig
  setConfigProp: (key: string, value: unknown) => void
}

export const ConfigContext = createContext({
  config: defaultConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setConfigProp: (_key: string, _value: unknown): void => {
    throw new Error('Unimplemented.')
  },
})

export const keyFor = (key: string) => `video-eval_config_${key}`

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState((() => {
    return Object.fromEntries(
      Object.entries(defaultConfig).map(([k, v]) => {
        return [k, localStorage.getItem(keyFor(k)) ?? v]
      })
    )
  })() as typeof defaultConfig)
  const setConfigProp = (key: string, value: unknown) => {
    localStorage.setItem(keyFor(key), String(value))
    setConfig((c) => ({ ...c, [key]: String(value) }))
  }
  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfigProp,
      }}
    >
      {children}
    </ConfigContext.Provider>
  )
}