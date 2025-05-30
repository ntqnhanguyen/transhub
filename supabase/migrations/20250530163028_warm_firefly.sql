-- Drop existing objects if they exist
drop materialized view if exists public.team_members_with_profiles;
drop function if exists refresh_team_members_with_profiles();
drop function if exists ensure_user_profile_exists();

-- Create materialized view
create materialized view public.team_members_with_profiles as
select 
    tm.id,
    tm.team_id,
    tm.user_id,
    tm.role,
    tm.created_at,
    tm.updated_at,
    up.full_name,
    up.avatar_url,
    up.email,
    up.preferred_language
from 
    public.team_members tm
    inner join public.user_profiles up on up.user_id = tm.user_id;

-- Create unique index
create unique index team_members_with_profiles_id on public.team_members_with_profiles(id);

-- Enable RLS
alter materialized view public.team_members_with_profiles enable row level security;

-- Create RLS policy
create policy "Users can view their own team memberships and team owners can view all"
    on public.team_members_with_profiles
    for select
    using (
        user_id = auth.uid() 
        or exists (
            select 1 
            from public.teams 
            where teams.id = team_id 
            and teams.owner_id = auth.uid()
        )
    );

-- Create refresh function
create or replace function public.refresh_team_members_with_profiles()
returns trigger
security definer
set search_path = public
language plpgsql as $$
begin
    refresh materialized view public.team_members_with_profiles;
    return null;
end;
$$;

-- Create triggers for refreshing the view
create trigger refresh_team_members_view_insert
    after insert on public.team_members
    for each statement
    execute function public.refresh_team_members_with_profiles();

create trigger refresh_team_members_view_update
    after update on public.team_members
    for each statement
    execute function public.refresh_team_members_with_profiles();

create trigger refresh_team_members_view_delete
    after delete on public.team_members
    for each statement
    execute function public.refresh_team_members_with_profiles();

create trigger refresh_team_members_view_profile_change
    after insert or update or delete on public.user_profiles
    for each statement
    execute function public.refresh_team_members_with_profiles();

-- Create user profile check function
create or replace function public.ensure_user_profile_exists()
returns trigger
security definer
set search_path = public
language plpgsql as $$
begin
    if not exists (
        select 1 
        from public.user_profiles 
        where user_id = new.user_id
    ) then
        raise exception 'User profile does not exist for user_id: %', new.user_id;
    end if;
    return new;
end;
$$;

-- Add profile check trigger
create trigger check_user_profile_exists
    before insert or update on public.team_members
    for each row
    execute function public.ensure_user_profile_exists();