// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';
import {
  supabaseUrl,
  supabaseServiceRoleKey,
} from '../../lib/consts';

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseServiceRoleKey || ''
);

type Data = {
  count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ count: 20 });
}
