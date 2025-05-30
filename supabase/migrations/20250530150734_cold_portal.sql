-- Drop existing policies to avoid conflicts
drop policy if exists "View teams" on public.teams;
drop policy if exists "Create teams" on public.teams;
drop policy if exists "Update teams" on public.teams;
drop policy if exists "Delete teams" on public.teams;
drop policy if exists "View team members" on public.team_members;
drop policy if exists "Manage team members" on public.team_members;

-- Create simplified team policies without circular dependencies
create policy "View teams"
    on public.teams for select
    using (
        auth.uid() = owner_id
        or id in (
            select team_id 
            from team_members 
            where user_id = auth.uid()
        )
    );

create policy "Create teams"
    on public.teams for insert
    to authenticated
    with check (auth.uid() = owner_id);

create policy "Update teams"
    on public.teams for update
    using (auth.uid() = owner_id);

create policy "Delete teams"
    on public.teams for delete
    using (auth.uid() = owner_id);

-- Create simplified team member policies without circular dependencies
create policy "View team members"
    on public.team_members for select
    using (
        user_id = auth.uid()
        or team_id in (
            select id 
            from teams 
            where owner_id = auth.uid()
        )
    );

create policy "Manage team members"
    on public.team_members for all
    using (
        team_id in (
            select id 
            from teams 
            where owner_id = auth.uid()
        )
        or (
            team_id in (
                select team_id 
                from team_members 
                where user_id = auth.uid() 
                and role = 'admin'
            )
        )
    );

-- Ensure indexes exist for performance
create index if not exists idx_teams_owner_id on public.teams(owner_id);
create index if not exists idx_team_members_team_id on public.team_members(team_id);
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_team_members_team_id_user_id on public.team_members(team_id, user_id);