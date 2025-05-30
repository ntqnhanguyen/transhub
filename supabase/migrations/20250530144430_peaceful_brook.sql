-- Drop existing policies on team_members
drop policy if exists "Team owners and admins can manage team members" on public.team_members;
drop policy if exists "Users can view team members" on public.team_members;

-- Create new, fixed policies for team_members
create policy "Users can view team members"
    on public.team_members for select
    using (
        exists (
            select 1 from public.teams
            where teams.id = team_members.team_id
            and (
                teams.owner_id = auth.uid()
                or auth.uid() = team_members.user_id
            )
        )
    );

create policy "Team owners can manage team members"
    on public.team_members for all
    using (
        exists (
            select 1 from public.teams
            where teams.id = team_members.team_id
            and teams.owner_id = auth.uid()
        )
    );

create policy "Team admins can manage team members"
    on public.team_members for all
    using (
        exists (
            select 1 from public.team_members as admin_members
            where admin_members.team_id = team_members.team_id
            and admin_members.user_id = auth.uid()
            and admin_members.role = 'admin'
        )
    );