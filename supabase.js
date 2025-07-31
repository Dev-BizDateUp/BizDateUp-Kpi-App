require('dotenv').config();
const { createClient } =  require('@supabase/supabase-js')
const supabaseUrl = process.env.supabaseUrls
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
module.exports = supabase;