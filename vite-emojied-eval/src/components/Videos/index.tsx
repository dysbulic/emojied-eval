export default () => {
  const { supabase, hasJWT, error: supaError } = useSupabase()
  const { isLoading, error, data } = useQuery()

  let content = null

  return null
}