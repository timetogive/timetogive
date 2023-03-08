import { supabase } from './supabase';

export const getTaskSupabaseCall = (
  taskId: string,
  longitude?: number,
  latitude?: number
) => {
  const query = supabase.rpc('get_task', {
    p_id: taskId,
    ...(!!longitude && !!latitude
      ? { p_longitude: longitude, p_latitude: latitude }
      : undefined),
  });

  return query;
};

export const getConversationsSupabaseCall = (taskId: string) => {
  const query = supabase.rpc('get_task_conversations', {
    p_id: taskId,
  });
  return query;
};

export const getOffersSupabaseCall = (taskId: string) => {
  const query = supabase.rpc('get_task_offers', {
    p_task_id: taskId,
  });
  return query;
};

export const getProfileSupabaseCall = (userId: string) => {
  const query = supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return query;
};

export const getPendingOfferSupabaseCall = (
  taskId: string,
  userId: string
) => {
  console.log('In getPendingOfferSupabaseCall');
  console.log({ taskId, userId });
  const query = supabase
    .from('task_offers')
    .select('*')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .eq('status', 'Pending')
    .single();

  return query;
};

export const getMessagesSupabaseCall = (
  taskId: string,
  authUserId: string,
  userId: string
) => {
  const query = supabase
    .from('task_messages')
    .select('from_user_id, to_user_id, message_text')
    .eq('task_id', taskId)
    .or(`from_user_id.eq.${authUserId},from_user_id.eq.${userId}`)
    .order('created_datetime', { ascending: true });

  return query;
};
