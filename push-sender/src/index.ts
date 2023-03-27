import http from 'http';
import path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';
dotenv.config({ path: path.resolve('.env') });

let iter = 0;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey
);

const channel = supabase
  .channel('online')
  .on('presence', { event: 'sync' }, () => {
    console.log('sync');
    const state = channel.presenceState();
    console.log(state);
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('join');
    console.log(key, newPresences);
  })
  .subscribe();

const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
    `TTG push notification sending service. Number of iterations since starting ${iter}`
  );
});

const keepLooping = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    iter = iter + 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

// Start the server on port 3000
app.listen(8080, '127.0.0.1');
console.log('Node server running on port 8080');

keepLooping();
