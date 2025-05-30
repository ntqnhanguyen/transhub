-- Drop the existing foreign key constraint if it exists
alter table public.team_members
drop constraint if exists team_members_user_id_fkey;

-- Add the foreign key constraint back
alter table public.team_members
add constraint team_members_user_id_fkey 
foreign key (user_id) 
references auth.users(id) 
on delete cascade;