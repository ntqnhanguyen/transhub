-- Drop existing tables and their dependencies
drop table if exists public.team_members cascade;
drop table if exists public.teams cascade;
drop table if exists public.project_members cascade;

-- Create teams table
create table public.teams (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    owner_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Create team_members table
create table public.team_members (
    id uuid default gen_random_uuid() primary key,
    team_id uuid references public.teams(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role team_role not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    unique(team_id, user_id)
);

-- Create project_members table
create table public.project_members (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role team_role not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    unique(project_id, user_id)
);

-- Enable RLS
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.project_members enable row level security;

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