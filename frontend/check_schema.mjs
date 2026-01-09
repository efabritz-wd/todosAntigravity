
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvrpinaoqwehccmqzeek.supabase.co';
const supabaseAnonKey = 'sb_publishable_CWglXNgU00u2MMz4av-Lgg_0FSfpvl9';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data sample:', data);
        if (data && data.length > 0) {
            console.log('Keys:', Object.keys(data[0]));
        } else {
            // If empty, try to insert a dummy to see errors or success? 
            // Or just assume standard columns. 
            // But verifying empty table doesn't give keys unless I can reflect. 
            // I'll try to insert a row with title and text and see if it errors.
            console.log("Table is empty, attempting speculative insert...");
            const { error: insertError } = await supabase
                .from('todos')
                .insert([{ title: 'Test Title', text: 'Test Text', user_id: 'test' }]); // user_id might fail foreign key if auth needed.

            // Actually, without auth I probably can't insert due to RLS.
            // I should try to sign in first? The previous test code relies on UI auth.
            // I'll just check if the previous 'fetchTodos' worked in the app.
            // I'll assume the user implies they WANT this feature.
            // I'll ask the user if the DB supports it or if they want me to add it to the UI and hope? 
            // No, best is to check what I can.
        }
    }
}

checkSchema();
