-- Drop existing tables to rebuild with proper relationships
drop table if exists public.team_members cascade;
drop table if exists public.teams cascade;
drop table if exists public.project_members cascade;
drop table if exists public.user_profiles cascade;

-- Create user_profiles table first
create table public.user_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    full_name text not null,
    avatar_url text,
    preferred_language text default 'en',
    email text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    unique(user_id),
    unique(email)
);

-- Create teams table
create table public.teams (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    owner_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Create team_members table with proper relationships
create table public.team_members (
    id uuid primary key default gen_random_uuid(),
    team_id uuid references public.teams(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role team_role not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    unique(team_id, user_id)
);

-- Create project_members table
create table public.project_members (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references public.projects(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role team_role not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    unique(project_id, user_id)
);

-- Enable RLS
alter table public.user_profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.project_members enable row level security;

-- User profiles policies
create policy "Users can view their own profile"
    on public.user_profiles for select
    using (auth.uid() = user_id);

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Teams policies
create policy "View teams"
    on public.teams for select
    using (
        auth.uid() = owner_id
        or auth.uid() in (
            select user_id 
            from team_members 
            where team_members.team_id = teams.id
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

-- Team members policies
create policy "View team members"
    on public.team_members for select
    using (
        auth.uid() = user_id
        or auth.uid() in (
            select owner_id 
            from teams 
            where teams.id = team_members.team_id
        )
    );

create policy "Manage team members"
    on public.team_members for all
    using (
        auth.uid() in (
            select owner_id 
            from teams 
            where teams.id = team_members.team_id
        )
    );

-- Project members policies
create policy "View project members"
    on public.project_members for select
    using (
        auth.uid() = user_id
        or auth.uid() in (
            select owner_id 
            from projects 
            where projects.id = project_members.project_id
        )
    );

create policy "Manage project members"
    on public.project_members for all
    using (
        auth.uid() in (
            select owner_id 
            from projects 
            where projects.id = project_members.project_id
        )
    );

-- Create indexes for better performance
create index idx_user_profiles_user_id on public.user_profiles(user_id);
create index idx_user_profiles_email on public.user_profiles(email);
create index idx_teams_owner_id on public.teams(owner_id);
create index idx_team_members_team_id on public.team_members(team_id);
create index idx_team_members_user_id on public.team_members(user_id);
create index idx_team_members_team_id_user_id on public.team_members(team_id, user_id);
create index idx_project_members_project_id on public.project_members(project_id);
create index idx_project_members_user_id on public.project_members(user_id);
create index idx_project_members_project_id_user_id on public.project_members(project_id, user_id);

-- Create trigger function for handling member deletions
create or replace function handle_team_member_deletion()
returns trigger as $$
begin
    -- Prevent deletion of the last owner
    if old.role = 'owner' then
        if not exists (
            select 1 
            from team_members
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

-- Create trigger for team member deletion
create trigger check_team_member_deletion
    before delete on public.team_members
    for each row
    execute function handle_team_member_deletion();

-- Create function to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_user_profiles_updated_at
    before update on public.user_profiles
    for each row
    execute function update_updated_at_column();

create trigger update_teams_updated_at
    before update on public.teams
    for each row
    execute function update_updated_at_column();

create trigger update_team_members_updated_at
    before update on public.team_members
    for each row
    execute function update_updated_at_column();

create trigger update_project_members_updated_at
    before update on public.project_members
    for each row
    execute function update_updated_at_column();