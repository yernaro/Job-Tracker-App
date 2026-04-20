import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://ccmoonpbrnffvykzpfkd.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbW9vbnBicm5mZnZ5a3pwZmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODY0NTgsImV4cCI6MjA1Nzc2MjQ1OH0.iiveeXL34ZXTDhsqznhp3rFtVVQApCW4tfVyjikhHpQ'

export const supabase = createClient(supabaseUrl, supabaseKey);