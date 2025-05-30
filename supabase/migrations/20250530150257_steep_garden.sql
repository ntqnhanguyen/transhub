-- Drop existing policies to avoid conflicts
drop policy if exists "View team members" on public.team_members;
drop policy if exists "Manage team members as owner" on public.team_members;
drop policy if exists "Manage team members as admin" on public.team_members;

-- Drop and recreate the foreign key constraint with proper references
alter table public.team_members
drop constraint if exists team_members_user_id_fkey;

alter table public.team_members
add constraint team_members_user_id_fkey 
foreign key (user_id) 
references auth.users(id) 
on delete cascade;

-- Create simplified policies with proper joins
create policy "View team members"
    on public.team_members for select
    using (
        (auth.uid() = user_id) OR 
        (EXISTS ( 
            SELECT 1 
            FROM teams 
            WHERE teams.id = team_members.team_id 
            AND teams.owner_id = auth.uid()
        ))
    );

create policy "Manage team members as owner"
    on public.team_members for all
    using (
        EXISTS (
            SELECT 1 
            FROM teams 
            WHERE teams.id = team_members.team_id 
            AND teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members as admin"
    on public.team_members for all
    using (
        EXISTS (
            SELECT 1 
            FROM team_members tm
            WHERE tm.team_id = team_members.team_id 
            AND tm.user_id = auth.uid() 
            AND tm.role = 'admin'
        )
    );

-- Add index to improve join performance
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_team_members_team_id on public.team_members(team_id);