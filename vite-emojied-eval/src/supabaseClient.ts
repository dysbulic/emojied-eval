import { createClient } from '@supabase/supabase-js'
import { supabase as supaConfig } from './config.ts'

export const supabase = createClient(supaConfig.url, supaConfig.anonKey)

export default supabase;
