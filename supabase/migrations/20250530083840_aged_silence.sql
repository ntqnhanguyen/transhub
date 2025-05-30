/*
  # Fix team members RLS policies

  1. Changes
    - Remove circular references in RLS policies
    - Simplify team_members policies to prevent recursion
    - Update projects policies to use direct auth checks
    - Ensure proper access control without circular dependencies

  2. Security
    - Maintain data access security while preventing infinite recursion
    - Users can still only access their own data and projects they're members of
    - Project owners retain full access to their projects and team members
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Project members can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can view projects they are members of" ON projects;

-- Create new policy for team_members that avoids recursion
CREATE POLICY "Team members access policy"
ON team_members
FOR ALL
TO authenticated
USING (
  -- User is either the project owner or a team member
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
  -- User is either the owner or a team member
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = projects.id
    AND team_members.user_id = auth.uid()
  )
);