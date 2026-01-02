import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdcexwvumtbhaqmiqqvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkY2V4d3Z1bXRiaGFxbWlxcXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODI4NjQsImV4cCI6MjA4Mjg1ODg2NH0.rtvySzEsMCCOm-DhkIa6kQQEKRxMlTY0bgpqAdrewJc';

export const supabase = createClient(supabaseUrl, supabaseKey);