-- Drop existing policies
DROP POLICY IF EXISTS "Team members access policy" ON team_members;
DROP POLICY IF EXISTS "Projects access policy" ON projects;
DROP POLICY IF EXISTS "Project members can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can view projects they are members of" ON projects;

-- Create new policy for team_members that avoids recursion
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_members' 
    AND policyname = 'Team members access policy'
  ) THEN
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
  END IF;
END $$;

-- Create new policy for projects that avoids recursion
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'projects' 
    AND policyname = 'Projects access policy'
  ) THEN
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
  END IF;
END $$;