const { createClient } =  require('@supabase/supabase-js')
const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;