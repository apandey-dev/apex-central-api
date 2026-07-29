import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_KEY || 'placeholder-key'
);

export const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'uploads';

export const uploadToSupabase = async (
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  userId?: string
): Promise<string> => {
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder')) {
    throw new Error('Supabase URL and API Key must be configured in environment variables.');
  }

  const userFolder = userId || 'general';
  const path = `${userFolder}/${Date.now()}-${filename}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};
