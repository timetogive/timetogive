\echo '---------------------------'
\echo 'Create functions'
\echo '---------------------------'

\ir handle_new_user.sql
\ir search_tasks.sql
\ir create_task.sql
\ir create_task_message.sql
\ir get_task.sql
\ir get_task_conversations.sql
\ir create_task_offer.sql
\ir get_task_offers.sql
\ir action_task_offer.sql
\ir mark_task_conversation_read.sql
\ir save_home_polygon.sql
\ir save_last_search_location.sql
\ir mark_notification_delivered.sql
\ir action_task.sql
\ir account_check.sql
\ir delete_account.sql

-- This tells postgrest to reload the schema
NOTIFY pgrst, 'reload schema';
