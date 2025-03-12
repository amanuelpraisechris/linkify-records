
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Initialize the Supabase client
const supabaseUrl = 'https://opwsrkvaqdxymqlhbhpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wd3Nya3ZhcWR4eW1xbGhiaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3Njg2ODEsImV4cCI6MjA1NzM0NDY4MX0.GmqPCvh-ePsPk3ICLKFBQCEglx_S3TMX7ASfn-rbJ8c';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
