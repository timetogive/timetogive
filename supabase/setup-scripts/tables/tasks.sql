\echo '---------------------------'
\echo 'Setting up tasks'
\echo '---------------------------'

CREATE TYPE public.task_status AS ENUM (
   'Live', /* The default */
   'Closed' /* Listing has been closed automatically or by user */
);

CREATE TYPE public.task_reason AS ENUM (
   'Charity', -- its for a charity
   'Community', -- it benefits the community
   'In Need', -- someone who it genuinely in need
   'Mutual Benefit', -- for mutual benefit to both parties - hooking up for a coffee, speaking a foreign language
   'Return For Pledge' -- it's a job that might normally be paid for but will be paid for via a pledge
);

CREATE TYPE public.task_estimate_units AS ENUM (
   'Minutes',
   'Hours',
   'Days'
);

CREATE TYPE public.task_timing AS ENUM (
    'Any Time',
    'Specific Time'
);

create table public.tasks(
   id uuid not null primary key default uuid_generate_v4(),
   user_id uuid references public.profiles not null, -- who created this
   status task_status not null default 'Live',
   reason task_reason not null default 'In Need',
   will_pledge boolean not null default false,  -- is there a pledge
   pledge text, -- if there is a pledge what is it - e.g. "Will give £5 to cancer research"
   title text not null, -- e.g. "Fix wifi for elderly person"
   description text, -- e.g. "This task is for an elderly person living in Asheridge who is having an issue with her wifi. Any tech savvy people with who can help?"
   effort_estimate integer, -- e.g. 10
   effort_estimate_units task_estimate_units default 'Minutes', -- Minutes, Hours, Days
   effort_estimate_in_minutes integer, -- normalised to minutes for query performance reasons
   people_estimate int default 1, -- estimated number of people to help (single-person or multi person task)
   timing task_timing not null default 'Any Time', -- is the help needed at a specific time
   geo_location geography(Point) not null, -- always needs a geolocation (even if not relevant - so that tasks always have a geographical target)
   fuzzy_geo_location geography(Point) not null, -- random location close to the geolocation (to protect privacy)
   remote boolean not null default false, -- can this task be done remotely?
   created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null, -- when the task was created
   has_images boolean default false,
   images_data jsonb default '[]'::jsonb not null
);

alter table public.tasks enable row level security;

create policy "Users can update own tasks." on public.tasks
  for update using (auth.uid() = id);

create policy "All users can view all tasks."
   on public.tasks
   for select using (true);