-- Drop existing policies on teams
drop policy if exists "Users can view their owned teams" on public.teams;
drop policy if exists "Users can view teams they are members of" on public.teams;
drop policy if exists "Team owners can update their teams" on public.teams;
drop policy if exists "Team owners can delete their teams" on public.teams;
drop policy if exists "Authenticated users can create teams" on public.teams;

-- Create simplified policies for teams
create policy "Users can view owned teams"
    on public.teams for select
    using (auth.uid() = owner_id);

create policy "Users can view member teams"
    on public.teams for select
    using (
        exists (
            select 1 from team_members
            where team_members.team_id = id
            and team_members.user_id = auth.uid()
        )
    );

create policy "Users can create teams"
    on public.teams for insert
    with check (auth.uid() = owner_id);

create policy "Owners can update teams"
    on public.teams for update
    using (auth.uid() = owner_id);

create policy "Owners can delete teams"
    on public.teams for delete
    using (auth.uid() = owner_id);

-- Drop and recreate team_members policies to avoid recursion
drop policy if exists "Users can view team members" on public.team_members;
drop policy if exists "Team owners can manage team members" on public.team_members;
drop policy if exists "Team admins can manage team members" on public.team_members;

create policy "View team members"
    on public.team_members for select
    using (
        auth.uid() = user_id
        or exists (
            select 1 from teams
            where teams.id = team_id
            and teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members as owner"
    on public.team_members for all
    using (
        exists (
            select 1 from teams
            where teams.id = team_id
            and teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members as admin"
    on public.team_members for all
    using (
        exists (
            select 1 from team_members tm
            where tm.team_id = team_id
            and tm.user_id = auth.uid()
            and tm.role = 'admin'
        )
    );