\echo '---------------------------'
\echo 'Setting up tasks'
\echo '---------------------------'

create table public.tasks(
   id uuid not null primary key default uuid_generate_v4(),
   user_id uuid references public.profiles not null, -- who created this
   status task_status not null default 'Live',
   reason task_reason not null default 'In Need',
   will_pledge boolean not null default false,  -- is there a pledge
   pledge text, -- if there is a pledge what is it - e.g. "Will give £5 to cancer research"
   title text not null, -- e.g. "Fix wifi for elderly person"
   description text, -- e.g. "This task is for an elderly person living in Asheridge who is having an issue with her wifi. Any tech savvy people with who can help?"
   effort_days integer,
   effort_hours integer,
   effort_minutes integer,
   effort_normalised_minutes integer, -- for performance we convert the days, hours and minutes into minutes
   effort_people int default 1, -- estimated number of people to help (single-person or multi person task)
   timing text not null default 'Any Time', -- is the help needed at a specific time
   remote boolean not null default false, -- can this task be done remotely?
   geo_location geography(Point) not null, -- always needs a geolocation (even if not relevant - so that tasks always have a geographical target)
   fuzzy_geo_location geography(Point) not null, -- random location close to the geolocation (to protect privacy)
   created_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP not null, -- when the task was created
   has_images boolean default false,
   images_data jsonb default '[]'::jsonb not null,
   lifespan_days integer not null default 30 -- how long the task should be live for
);

alter table public.tasks enable row level security;

create policy "Users can update own tasks." on public.tasks
  for update using (auth.uid() = id);

create policy "All users can view all tasks."
   on public.tasks
   for select using (true);