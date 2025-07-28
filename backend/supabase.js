const { createClient } =  require('@supabase/supabase-js')
const supabaseUrl = process.env.supabaseUrl
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
module.exports = supabase;