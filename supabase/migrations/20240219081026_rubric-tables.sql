CREATE TABLE IF NOT EXISTS rubrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name text NOT NULL,
  feedback_group_id uuid NOT NULL,
  default_weight float8 DEFAULT 0 NOT NULL,
  creator_id uuid DEFAULT auth.uid() NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT feedback_group_id_fkey FOREIGN KEY (feedback_group_id)
    REFERENCES feedback_groups (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS feedbacks_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  feedback_id uuid NOT NULL,
  rubric_id uuid NOT NULL,
  weight float8 DEFAULT 0 NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT feedback_id_fkey FOREIGN KEY (feedback_id)
    REFERENCES feedbacks (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT rubric_id_fkey FOREIGN KEY (rubric_id)
    REFERENCES rubrics (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT feedback_rubric_unique
    UNIQUE (feedback_id, rubric_id)
);