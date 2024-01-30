export const capitalize = (str: string) => (
  str.replace(
    /(?<!\p{L})\p{L}(?=\p{L}{2})/gu,
    (ltr: string) => ltr.toUpperCase(),
  )
)

export const image = (str: string) => {
  if(/^(https?|ipfs):\/\//.test(str)) {
    return <img src={str} className="emoji"/>
  }
  return <span className="emoji">{str}</span>
}
