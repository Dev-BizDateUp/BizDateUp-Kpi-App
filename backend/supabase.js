const SUPABASE_URL = "https://wwbmfysrdihxlmgwhxqq.supabase.co"
import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'https://wwbmfysrdihxlmgwhxqq.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(SUPABASE_URL, process.env.SERVICE_KEY);


module.exports = supabase;