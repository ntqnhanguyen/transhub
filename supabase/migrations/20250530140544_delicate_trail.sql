-- Create teams table
create table if not exists public.teams (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    owner_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create team_invitations table
create table if not exists public.team_invitations (
    id uuid default uuid_generate_v4() primary key,
    team_id uuid not null references public.teams(id) on delete cascade,
    email text not null,
    role team_role not null,
    invited_by uuid not null references auth.users(id),
    status text default 'pending' check (status in ('pending', 'accepted', 'declined')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    expires_at timestamp with time zone default timezone('utc'::text, now() + interval '7 days') not null
);

-- Add RLS policies
alter table public.teams enable row level security;
alter table public.team_invitations enable row level security;

-- Teams policies
create policy "Users can view teams they belong to"
    on public.teams for select
    using (
        auth.uid() = owner_id
        or exists (
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

-- Team invitations policies
create policy "Team owners and admins can create invitations"
    on public.team_invitations for insert
    with check (
        exists (
            select 1 from public.team_members
            where team_members.team_id = team_invitations.team_id
            and team_members.user_id = auth.uid()
            and team_members.role in ('owner', 'admin')
        )
    );

create policy "Users can view invitations for their teams"
    on public.team_invitations for select
    using (
        exists (
            select 1 from public.team_members
            where team_members.team_id = team_invitations.team_id
            and team_members.user_id = auth.uid()
        )
        or email = (
            select email from auth.users
            where id = auth.uid()
        )
    );

create policy "Team owners and admins can update invitations"
    on public.team_invitations for update
    using (
        exists (
            select 1 from public.team_members
            where team_members.team_id = team_invitations.team_id
            and team_members.user_id = auth.uid()
            and team_members.role in ('owner', 'admin')
        )
    );

-- Create functions
create or replace function public.handle_team_member_deletion()
returns trigger as $$
begin
    -- Prevent deletion of the last owner
    if old.role = 'owner' then
        if not exists (
            select 1 from public.team_members
            where team_id = old.team_id
            and role = 'owner'
            and user_id != old.user_id
        ) then
            raise exception 'Cannot delete the last team owner';
        end if;
    end if;
    return old;
end;
$$ language plpgsql security definer;

-- Create trigger for team member deletion
create trigger check_team_member_deletion
    before delete on public.team_members
    for each row
    execute function public.handle_team_member_deletion();