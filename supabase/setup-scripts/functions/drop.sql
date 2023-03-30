\echo '---------------------------'
\echo 'Drop functions'
\echo '---------------------------'

drop function if exists handle_new_user;
drop function if exists search_tasks;
drop function if exists create_task;
drop function if exists create_task_message;
drop function if exists get_task;
drop function if exists get_task_conversations;
drop function if exists create_task_offer;
drop function if exists get_task_offers;
drop function if exists action_task_offer;
drop function if exists mark_task_conversation_read;
drop function if exists save_home_polygon;
drop function if exists save_last_search_location;
drop function if exists mark_notification_delivered;
drop function if exists action_task;

