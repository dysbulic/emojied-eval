ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS feedback_group_id uuid;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   information_schema.table_constraints 
        WHERE  constraint_name = 'videos_feedback_group_id_fkey'
    ) THEN
        ALTER TABLE videos
          ADD CONSTRAINT videos_feedback_group_id_fkey
            FOREIGN KEY (feedback_group_id)
            REFERENCES feedback_groups(id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE SET NULL;
    END IF;
END
$$;
