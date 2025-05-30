/*
  # Fix infinite recursion in projects policy

  1. Changes
    - Simplify projects RLS policy to avoid recursion
    - Remove complex team member checks from policy
    - Add separate policies for different operations
  
  2. Security
    - Maintain data access security
    - Prevent unauthorized access
    - Allow project owners full access
    - Allow team members read access
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Projects access policy" ON projects;

-- Create separate policies for different operations
CREATE POLICY "Project owners have full access"
ON projects
FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Team members can only read projects
CREATE POLICY "Team members can view projects"
ON projects
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.project_id = id
    AND team_members.user_id = auth.uid()
  )
);