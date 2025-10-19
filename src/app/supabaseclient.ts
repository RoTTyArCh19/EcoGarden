import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wvxxoktyridtnznjjawh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2eHhva3R5cmlkdG56bmpqYXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjAyMTEsImV4cCI6MjA3NjQzNjIxMX0.mChV96oo--SDGU6Oiw_pzswsy_GEqjAa7mV0_JYuLok';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
