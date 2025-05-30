/*
  # Fix projects table RLS policies

  1. Changes
    - Simplify projects table RLS policies to avoid recursion
    - Remove complex subqueries from policies
    - Ensure proper access control while preventing infinite recursion

  2. Security
    - Maintain row-level security
    - Ensure users can only access their own projects or projects they are members of
    - Prevent unauthorized access while avoiding recursive checks
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Projects access policy" ON projects;
DROP POLICY IF EXISTS "Project owners have full access" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Owners can update their projects" ON projects;

-- Create simplified policies without recursive checks
CREATE POLICY "Users can create projects"
ON projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners have full access"
ON projects
FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team members can view projects"
ON projects
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM team_members 
    WHERE team_members.project_id = projects.id
  )
);

CREATE POLICY "Team members can update projects"
ON projects
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM team_members 
    WHERE team_members.project_id = projects.id
    AND role IN ('admin', 'owner')
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM team_members 
    WHERE team_members.project_id = projects.id
    AND role IN ('admin', 'owner')
  )
);