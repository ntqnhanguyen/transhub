-- Create teams table if it doesn't exist
create table if not exists public.teams (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    owner_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Create team_members table if it doesn't exist
create table if not exists public.team_members (
    id uuid default gen_random_uuid() primary key,
    team_id uuid references public.teams(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role team_role not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    unique(team_id, user_id)
);

-- Enable RLS on both tables
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "View teams" on public.teams;
drop policy if exists "Create teams" on public.teams;
drop policy if exists "Update teams" on public.teams;
drop policy if exists "Delete teams" on public.teams;
drop policy if exists "View team members" on public.team_members;
drop policy if exists "Manage team members" on public.team_members;

-- Create simplified team policies
create policy "View teams"
    on public.teams for select
    using (
        auth.uid() = owner_id
        or exists (
            select 1 
            from team_members 
            where team_members.team_id = teams.id 
            and team_members.user_id = auth.uid()
        )
    );

create policy "Create teams"
    on public.teams for insert
    to authenticated
    with check (auth.uid() = owner_id);

create policy "Update teams"
    on public.teams for update
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

create policy "Delete teams"
    on public.teams for delete
    using (auth.uid() = owner_id);

-- Create simplified team member policies
create policy "View team members"
    on public.team_members for select
    using (
        user_id = auth.uid()
        or exists (
            select 1 
            from teams 
            where teams.id = team_members.team_id 
            and teams.owner_id = auth.uid()
        )
    );

create policy "Manage team members"
    on public.team_members for all
    using (
        exists (
            select 1 
            from teams 
            where teams.id = team_members.team_id 
            and teams.owner_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 
            from teams 
            where teams.id = team_members.team_id 
            and teams.owner_id = auth.uid()
        )
    );

-- Ensure indexes exist for performance
create index if not exists idx_teams_owner_id on public.teams(owner_id);
create index if not exists idx_team_members_team_id on public.team_members(team_id);
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_team_members_team_id_user_id on public.team_members(team_id, user_id);