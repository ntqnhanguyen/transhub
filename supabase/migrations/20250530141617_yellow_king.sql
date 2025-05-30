-- Create projects table
create table if not exists public.projects (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    source_language text not null,
    target_languages text[] not null,
    progress integer default 0,
    status project_status default 'draft',
    owner_id uuid not null references auth.users(id) on delete cascade,
    due_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_members table to link projects with team members
create table if not exists public.project_members (
    id uuid default uuid_generate_v4() primary key,
    project_id uuid not null references public.projects(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role team_role not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(project_id, user_id)
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.project_members enable row level security;

-- Projects policies
create policy "Users can view their own projects and projects they are members of"
    on public.projects for select
    using (
        auth.uid() = owner_id
        or exists (
            select 1 from public.project_members
            where project_members.project_id = projects.id
            and project_members.user_id = auth.uid()
        )
    );

create policy "Project owners can update their projects"
    on public.projects for update
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id);

create policy "Project owners can delete their projects"
    on public.projects for delete
    using (auth.uid() = owner_id);

create policy "Authenticated users can create projects"
    on public.projects for insert
    with check (auth.uid() = owner_id);

-- Project members policies
create policy "Users can view project members"
    on public.project_members for select
    using (
        exists (
            select 1 from public.projects
            where projects.id = project_members.project_id
            and (
                projects.owner_id = auth.uid()
                or exists (
                    select 1 from public.project_members as pm
                    where pm.project_id = project_members.project_id
                    and pm.user_id = auth.uid()
                )
            )
        )
    );

create policy "Project owners and admins can manage project members"
    on public.project_members for all
    using (
        exists (
            select 1 from public.project_members
            where project_members.project_id = project_id
            and project_members.user_id = auth.uid()
            and project_members.role in ('owner', 'admin')
        )
    );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_projects_updated_at
    before update on public.projects
    for each row
    execute function update_updated_at_column();

create trigger update_project_members_updated_at
    before update on public.project_members
    for each row
    execute function update_updated_at_column();