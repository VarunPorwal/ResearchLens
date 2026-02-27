import { createClient } from '@supabase/supabase-js'

const isBrowser = typeof window !== 'undefined';
const supabaseUrl = isBrowser
    ? `${window.location.origin}/supabase-proxy`
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
