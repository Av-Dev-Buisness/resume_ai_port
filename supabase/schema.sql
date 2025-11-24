-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Resumes table
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  original_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.resumes enable row level security;

create policy "Users can view their own resumes"
  on public.resumes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own resumes"
  on public.resumes for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using ( auth.uid() = user_id );

-- Analyses table
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  resume_id uuid references public.resumes(id) on delete cascade,
  job_title text,
  job_description text,
  score_overall integer,
  score_format integer,
  score_keywords integer,
  score_clarity integer,
  suggestions jsonb,
  improved_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analyses enable row level security;

create policy "Users can view their own analyses"
  on public.analyses for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own analyses"
  on public.analyses for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own analyses"
  on public.analyses for delete
  using ( auth.uid() = user_id );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
