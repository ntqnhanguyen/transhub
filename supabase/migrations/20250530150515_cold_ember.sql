-- Drop existing policies
drop policy if exists "View team members" on public.team_members;
drop policy if exists "Manage team members as owner" on public.team_members;
drop policy if exists "Manage team members as admin" on public.team_members;
drop policy if exists "Users can view owned teams" on public.teams;
drop policy if exists "Users can view member teams" on public.teams;
drop policy if exists "Users can create teams" on public.teams;
drop policy if exists "Owners can update teams" on public.teams;
drop policy if exists "Owners can delete teams" on public.teams;

-- Create simplified team policies
create policy "View teams"
    on public.teams for select
    using (
        auth.uid() = owner_id
        or exists (
            select 1 from team_members
            where team_members.team_id = id
            and team_members.user_id = auth.uid()
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

-- Create simplified team member policies
create policy "View team members"
    on public.team_members for select
    using (
        auth.uid() = user_id
        or exists (
            select 1 from teams
            where teams.id = team_members.team_id
            and teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members"
    on public.team_members for all
    using (
        exists (
            select 1 from teams
            where teams.id = team_members.team_id
            and teams.owner_id = auth.uid()
        )
        or exists (
            select 1 from team_members tm
            where tm.team_id = team_members.team_id
            and tm.user_id = auth.uid()
            and tm.role = 'admin'
        )
    );

-- Add missing indexes
create index if not exists idx_teams_owner_id on public.teams(owner_id);
create index if not exists idx_team_members_team_id_user_id on public.team_members(team_id, user_id);

-- Update trigger function to handle team member changes
create or replace function handle_team_member_deletion()
returns trigger as $$
begin
    -- Prevent deletion of the last owner
    if old.role = 'owner' then
        if not exists (
            select 1 from team_members
            where team_id = old.team_id
            and role = 'owner'
            and id != old.id
        ) then
            raise exception 'Cannot delete the last team owner';
        end if;
    end if;
    return old;
end;
$$ language plpgsql security definer;