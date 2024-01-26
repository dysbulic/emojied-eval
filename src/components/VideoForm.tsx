import { useSupabase } from '../lib/useSupabase'

export const VideoForm = () => {
  const { supabase } = useSupabase()
  const onSubmit = async (evt) => {
    evt.preventDefault()
    console.debug({ url:evt.target.url.value })
    await supabase.from('videos').insert({
      url: evt.target.url.value, 
      title: evt.target.title.value, 
      description: evt.target.description.value, 
    })
  }
  return (
    <form {...{ onSubmit }}>
      <label>
        <h3>URL</h3>
        <input id="url" required/>
      </label>
      <label>
        <h3>Title</h3>
        <input id="title"/>
      </label>
      <label>
        <h3>Description</h3>
        <input id="description"/>
      </label>
      <button>Create</button>
    </form>
  )
}

export default VideoForm