CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  url text NOT NULL,
  creator_id uuid,
  slug text, 
  recorded_at timestamp with time zone,
  title text,
  description text,

  CONSTRAINT videos_creator_id_fkey FOREIGN KEY (creator_id)
    REFERENCES auth.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  image text,
  description text
);

CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  video_id uuid NOT NULL,
  reactor_id uuid NOT NULL,
  feedback_id uuid NOT NULL,

  CONSTRAINT reactions_video_id_fkey FOREIGN KEY (video_id)
    REFERENCES videos (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT reactions_reactor_id_fkey FOREIGN KEY (reactor_id)
    REFERENCES auth.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT reactions_feedback_id_fkey FOREIGN KEY (feedback_id)
    REFERENCES feedbacks (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  phrase text NOT NULL,
  weight double precision NOT NULL,
  feedback_id uuid NOT NULL,
  creator_id uuid NOT NULL,

  CONSTRAINT evaluations_feedback_id_fkey FOREIGN KEY (feedback_id)
    REFERENCES feedbacks (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL,

  CONSTRAINT evaluations_creator_id_fkey FOREIGN KEY (creator_id)
    REFERENCES auth.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL
);