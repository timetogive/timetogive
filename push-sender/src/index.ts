import http from 'http';
import path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

dotenv.config({ path: path.resolve('.env') });

const PAUSE = 30 * 60 * 1000; // 30 minutes

let iter = 0;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const expoAccessToken = process.env.EXPO_ACCESS_TOKEN || '';

const expo = new Expo({ accessToken: expoAccessToken });

const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey
);

const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
    `TTG push notification sending service. Number of iterations since starting ${iter}`
  );
});

const buildExpoPushMessage = (
  pushToken: string,
  notification: Database['public']['Tables']['notifications']['Row']
): ExpoPushMessage | undefined => {
  const { type, payload } = notification;
  if (type === 'TaskOffer') {
    const { taskOfferUserFullName, taskTitle } = payload as any;
    return {
      to: pushToken,
      sound: 'default',
      title: 'A new volunteer!',
      body: `${taskOfferUserFullName} has offered to help with "${taskTitle}"`,
      data: payload as any,
    };
  }
  if (type === 'TaskOfferAccepted') {
    const { taskOfferUserFullName, taskTitle } = payload as any;
    return {
      to: pushToken,
      sound: 'default',
      title: 'Your offer to help has been accepted!',
      body: `${taskOfferUserFullName} has accepted your offer to help with "${taskTitle}"`,
      data: payload as any,
    };
  }
  if (type === 'TaskOfferDeclined') {
    const { taskOfferUserFullName, taskTitle } = payload as any;

    return {
      to: pushToken,
      sound: 'default',
      title: 'Your offer to help has been declined',
      body: `${taskOfferUserFullName} has sadly declined your offer to help with "${taskTitle}"`,
      data: payload as any,
    };
  }
  if (type === 'TaskOfferCancelled') {
    const { taskOfferUserFullName, taskTitle } = payload as any;
    return {
      to: pushToken,
      sound: 'default',
      title: 'An offer to help has been withdrawn',
      body: `${taskOfferUserFullName} has withdrawn the offer to help with "${taskTitle}"`,
      data: payload as any,
    };
  }
  if (type === 'TaskMessage') {
    const { taskTitle } = payload as any;
    return {
      to: pushToken,
      sound: 'default',
      title: 'You have a new message',
      body: `You have a new message on "${taskTitle}"`,
      data: payload as any,
    };
  }
  return undefined;
};

const doWork = async () => {
  // TODO: this is all woefully inefficient, it should
  // be a single query that does all the work - it should also
  // collapse the notifications into single notifications
  // it could also focus on the last X minutes based on the size
  // of the pause
  const { data: pushTokensData, error: pushTokensError } =
    await supabase.from('push_tokens').select('*');
  if (pushTokensError) {
    console.log(pushTokensError);
    return;
  }
  if (!pushTokensData || pushTokensData.length === 0) {
    console.log('No push tokens therefore nothing to do');
    return;
  }

  // get all the notifications that are not yet delivered
  const { data: notificationsData, error: notificationsError } =
    await supabase
      .from('notifications')
      .select('*')
      .eq('delivered', false);
  if (notificationsError) {
    console.log(notificationsError);
    return;
  }
  if (!notificationsData || notificationsData.length === 0) {
    console.log('No data to process');
    return;
  }
  console.log('This is where we would send the notifications');

  const notificationsWithPushTokens = notificationsData.filter(
    (n) => !!pushTokensData.find((pt) => pt.user_id === n.user_id)
  );

  console.log(
    `There will be ${notificationsWithPushTokens.length} to send`
  );

  const messages: ExpoPushMessage[] = [];
  // Again horribly inefficient, but it's a start
  for (const notification of notificationsWithPushTokens) {
    // Get the matching push tokens
    const pushTokens = pushTokensData.filter(
      (pt) => pt.user_id === notification.user_id
    );
    for (const pushToken of pushTokens) {
      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken.push_token)) {
        console.error(
          `Push token ${pushToken} is not a valid Expo push token`
        );
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      const message = buildExpoPushMessage(
        pushToken.push_token,
        notification
      );
      console.log(message);
      if (message) {
        messages.push(message);
      }
    }
  }

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    const blah = await expo.sendPushNotificationsAsync(chunk);
    console.log(blah);
  }

  console.log(
    'Now marking notifications as delivered - this is obviously naive'
  );

  // Not ideal, but it's a start, we just mark them all as delivered
  for (const notification of notificationsWithPushTokens) {
    await supabase.rpc('mark_notification_delivered', {
      p_notification_id: notification.id,
    });
  }
};

const keepLooping = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    iter = iter + 1;
    await doWork();
    await new Promise((resolve) => setTimeout(resolve, PAUSE));
  }
};

// Start the server on port 3000
app.listen(8080, '127.0.0.1');
console.log('Node server running on port 8080');

keepLooping();
