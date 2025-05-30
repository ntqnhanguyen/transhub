-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  source_language TEXT NOT NULL,
  target_languages TEXT[] NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'translator',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- Drop existing policies
DROP POLICY IF EXISTS "Team members access policy" ON team_members;
DROP POLICY IF EXISTS "Projects access policy" ON projects;

-- Create new policy for projects
CREATE POLICY "Projects access policy"
ON projects
FOR ALL
TO authenticated
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = projects.id
    AND team_members.user_id = auth.uid()
  )
);

-- Create new policy for team_members
CREATE POLICY "Team members access policy"
ON team_members
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = team_members.project_id
    AND (
      projects.owner_id = auth.uid() OR
      team_members.user_id = auth.uid()
    )
  )
);

-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;