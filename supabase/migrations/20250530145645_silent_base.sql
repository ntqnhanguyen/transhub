-- Drop existing policies on teams
drop policy if exists "Users can view teams they belong to" on public.teams;
drop policy if exists "Team owners can update their teams" on public.teams;
drop policy if exists "Team owners can delete their teams" on public.teams;
drop policy if exists "Authenticated users can create teams" on public.teams;

-- Create new, fixed policies for teams
create policy "Users can view their owned teams"
    on public.teams for select
    using (auth.uid() = owner_id);

create policy "Users can view teams they are members of"
    on public.teams for select
    using (
        exists (
            select 1 from public.team_members
            where team_members.team_id = teams.id
            and team_members.user_id = auth.uid()
        )
    );

create policy "Team owners can update their teams"
    on public.teams for update
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

create policy "Team owners can delete their teams"
    on public.teams for delete
    using (auth.uid() = owner_id);

create policy "Authenticated users can create teams"
    on public.teams for insert
    with check (auth.uid() = owner_id);