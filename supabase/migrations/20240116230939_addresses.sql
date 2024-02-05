CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid UNIQUE,
  address text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES auth.users (id) MATCH SIMPLE
      ON UPDATE CASCADE
      ON DELETE SET NULL
);