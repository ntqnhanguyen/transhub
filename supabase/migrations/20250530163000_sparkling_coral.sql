-- Create materialized view instead of regular view
create materialized view if not exists public.team_members_with_profiles as
select 
    tm.*,
    up.full_name,
    up.avatar_url,
    up.email,
    up.preferred_language
from 
    public.team_members tm
    inner join public.user_profiles up on up.user_id = tm.user_id;

-- Create unique index for the materialized view
create unique index if not exists team_members_with_profiles_id on public.team_members_with_profiles(id);

-- Enable RLS on the materialized view
alter materialized view public.team_members_with_profiles owner to authenticated;
alter materialized view public.team_members_with_profiles set (security_barrier = on);

-- Create function to refresh the materialized view
create or replace function refresh_team_members_with_profiles()
returns trigger as $$
begin
    refresh materialized view concurrently public.team_members_with_profiles;
    return null;
end;
$$ language plpgsql security definer;

-- Create triggers to refresh the materialized view
create trigger refresh_team_members_view_insert
    after insert on public.team_members
    for each statement
    execute function refresh_team_members_with_profiles();

create trigger refresh_team_members_view_update
    after update on public.team_members
    for each statement
    execute function refresh_team_members_with_profiles();

create trigger refresh_team_members_view_delete
    after delete on public.team_members
    for each statement
    execute function refresh_team_members_with_profiles();

create trigger refresh_team_members_view_profile_change
    after insert or update or delete on public.user_profiles
    for each statement
    execute function refresh_team_members_with_profiles();

-- Create function to ensure user profile exists
create or replace function ensure_user_profile_exists()
returns trigger as $$
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
$$ language plpgsql security definer;

-- Add trigger to check user profile exists before team member insert
create trigger check_user_profile_exists
    before insert or update on public.team_members
    for each row
    execute function ensure_user_profile_exists();