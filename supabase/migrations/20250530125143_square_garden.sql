-- Create team_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS team_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role team_role DEFAULT 'translator'::team_role NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    source_language text NOT NULL,
    target_languages text[] NOT NULL,
    progress integer DEFAULT 0,
    status project_status DEFAULT 'draft'::project_status,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    due_date timestamptz
);

-- Drop existing policies
DROP POLICY IF EXISTS "Team members access policy" ON team_members;
DROP POLICY IF EXISTS "Projects access policy" ON projects;
DROP POLICY IF EXISTS "Project members can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can view projects they are members of" ON projects;

-- Enable RLS on tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create new policy for team_members that avoids recursion
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

-- Create new policy for projects that avoids recursion
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

-- Add foreign key constraint after both tables exist
ALTER TABLE team_members
ADD CONSTRAINT team_members_project_id_fkey
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;