-- Add view to join team members with user profiles
create or replace view public.team_members_with_profiles as
select 
    tm.*,
    up.full_name,
    up.avatar_url,
    up.email,
    up.preferred_language
from 
    public.team_members tm
    inner join public.user_profiles up on up.user_id = tm.user_id;

-- Add policy for the view
create policy "View team members with profiles"
    on public.team_members_with_profiles for select
    using (
        auth.uid() = user_id
        or auth.uid() in (
            select owner_id 
            from teams 
            where teams.id = team_id
        )
    );

-- Enable RLS on the view
alter view public.team_members_with_profiles set (security_invoker = on);

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