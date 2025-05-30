-- Drop existing policies to avoid conflicts
drop policy if exists "View team members" on public.team_members;
drop policy if exists "Manage team members as owner" on public.team_members;
drop policy if exists "Manage team members as admin" on public.team_members;

-- Add missing relationship between team_members and user_profiles
alter table public.team_members
add constraint team_members_user_id_fkey 
foreign key (user_id) 
references auth.users(id) 
on delete cascade;

-- Recreate policies with proper joins
create policy "View team members"
    on public.team_members for select
    using (
        user_id = auth.uid()
        or exists (
            select 1 from public.teams
            where teams.id = team_members.team_id
            and teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members as owner"
    on public.team_members for all
    using (
        exists (
            select 1 from public.teams
            where teams.id = team_members.team_id
            and teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members as admin"
    on public.team_members for all
    using (
        exists (
            select 1 from public.team_members tm
            where tm.team_id = team_members.team_id
            and tm.user_id = auth.uid()
            and tm.role = 'admin'
        )
    );