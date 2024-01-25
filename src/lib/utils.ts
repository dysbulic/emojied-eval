export const capitalize = (str: string) => (
  str.replace(
    /(?<!\p{L})\p{L}(?=\p{L}{2})/gu,
    (ltr: string) => ltr.toUpperCase(),
  )
)
