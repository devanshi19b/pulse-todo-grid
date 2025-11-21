-- Add work_type column to tasks table
ALTER TABLE public.tasks
ADD COLUMN work_type TEXT CHECK (work_type IN ('personal', 'professional'));

-- Set default value for existing tasks
UPDATE public.tasks SET work_type = 'personal' WHERE work_type IS NULL;