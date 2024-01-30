import { useQuery } from '@tanstack/react-query'; // Import useQuery
import useSupabase from '../../lib/useSupabase';
import { image } from '../../lib/utils';
import FeedbackForm from '../FeedbackForm';
import { useRef } from 'react';
import tyl from './index.module.css';

interface Feedback {
  id: number;
  image: string;
  title: string;
  description: string;
}

export const FeedbackGroups = () => {
  const { supabase } = useSupabase();
  const { data: feedbacks, isLoading: loading } = useQuery<Feedback[], unknown, Feedback[]>(
    ['FeedbackGroups', { supabase }], // Specify QueryKey type
    async () => {
      const { data } = (
        await supabase?.from('feedbacks').select()
      ) || { data: undefined };
      return data ?? []; // Ensure data is not undefined
    },
    { enabled: !!supabase } // Pass options object
  );

  const addDialog = useRef<HTMLDialogElement>(null);

  const addClick = async () => {
    (addDialog.current as HTMLDialogElement | null)?.showModal();
  };

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const { data: group } = await supabase?.from('feedback_groups').insert({
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLInputElement).value,
    }).select().single() ?? {};
    const checkedInputs = Array.from(form.elements.namedItem("grouped") as unknown as HTMLInputElement[])
      .filter((input) => (input as HTMLInputElement).checked) as HTMLInputElement[];
    const feedbacksToInsert = checkedInputs.map((input) => ({
      feedback_id: input.value,
      group_id: group.id
    }));
    await supabase?.from('feedbacks_groups').insert(feedbacksToInsert);

    form.reset();
  };

  if (loading) return <p>Loading…</p>;
  if (!feedbacks) return <p>No data available</p>; // Handle the case when feedbacks is undefined

  return (
    <section>
      <h1>Reactions</h1>
      <button onClick={addClick}>➕</button>
      <dialog ref={addDialog}>
        <FeedbackForm />
      </dialog>
      <form onSubmit={onSubmit}>
        <input name="title" id="title" required />
        <input name="description" id="description" />
        <ul className={tyl.olTable}>
          {feedbacks.map((feedback: Feedback) => (
            <li key={feedback.id}>
              <input type="checkbox" name="grouped" value={feedback.id} />
              {image(feedback.image)}
              <h2>{feedback.title}</h2>
              <div>{feedback.description}</div>
            </li>
          ))}
        </ul>
        <button type="submit">Create Group</button>
      </form>
    </section>
  );
};

export default FeedbackGroups;