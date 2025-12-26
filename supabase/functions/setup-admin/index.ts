import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Default admin credentials
    const defaultAdminEmail = 'admin@romansia.com';
    const defaultAdminPassword = 'Admin123!';

    console.log('Checking if admin already exists...');

    // Check if admin user already exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      throw new Error('Failed to check existing users');
    }

    const adminExists = existingUsers.users.some(user => user.email === defaultAdminEmail);

    if (adminExists) {
      console.log('Admin user already exists');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin user already exists',
          email: defaultAdminEmail 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log('Creating new admin user...');

    // Create the admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: defaultAdminEmail,
      password: defaultAdminPassword,
      email_confirm: true, // Auto-confirm the email
    });

    if (createError) {
      console.error('Error creating admin user:', createError);
      throw new Error(`Failed to create admin user: ${createError.message}`);
    }

    console.log('Admin user created:', newUser.user?.id);

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user!.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      throw new Error(`Failed to assign admin role: ${roleError.message}`);
    }

    console.log('Admin role assigned successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin account created successfully',
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        note: 'Please change the password after first login!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Setup admin error:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
