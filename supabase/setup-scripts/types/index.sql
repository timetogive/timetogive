create type public.task_full_info as (
   id uuid,
   user_id uuid,
   status task_status,
   reason task_reason,
   will_pledge boolean,
   pledge text,
   title text,
   description text,
   effort_days integer,
   effort_hours integer,
   effort_minutes integer,
   effort_normalised_minutes integer,
   effort_people int ,
   timing text,
   remote boolean ,
   longitude double precision,
   latitude double precision,
   created_datetime TIMESTAMP,
   distance double precision,
   user_full_name text,
   user_avatar_url text
);


create type public.notifications_item_type AS ENUM (
    'Task',
    'TaskOffer',
    'TaskOfferAccepted',
    'TaskOfferDeclined',
    'TaskOfferCancelled',
    'TaskMessage'
);

create type public.reviewee AS ENUM (
   'Task Lister', /* The default */
   'Volunteer' /* If the task has more than one person needed */
);

create type public.task_offer_status AS ENUM (
   'Pending',
   'Accepted',
   'Declined',
   'Cancelled'
);

create type public.task_status AS ENUM (
   'Live', /* The default */
   'Partially Assigned', /* If the task has more than one person needed */
   'Assigned', /* Once fully assigned or assigned to a single person task*/
   'Completed', /* Once completed it is marked completed */
   'Closed' /* Listing has been closed automatically or manually closed by the user */
);

create type public.task_reason AS ENUM (
   'Charity', -- its for a charity
   'Community', -- it benefits the community
   'In Need', -- someone who it genuinely in need
   'Mutual Benefit', -- for mutual benefit to both parties - hooking up for a coffee, speaking a foreign language
   'Return For Pledge' -- it's a job that might normally be paid for but will be paid for via a pledge
);





