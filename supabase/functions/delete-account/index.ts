// ==============================================================================
// TASKFLOW SUPABASE EDGE FUNCTION: delete-account
// Platform: Deno / TypeScript
// Description: GDPR & Google Play policy compliant permanent account deletion
// ==============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate the caller
    const supabaseUserClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized access: invalid user session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    // Use admin client with service_role to delete the user from auth.users
    // Cascading foreign keys in PostgreSQL will clean up profiles, tasks, subtasks, habits, etc.
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Explicit cleanup of records (extra safeguard)
    await Promise.allSettled([
      supabaseAdmin.from("tasks").delete().eq("user_id", userId),
      supabaseAdmin.from("habits").delete().eq("user_id", userId),
      supabaseAdmin.from("goals").delete().eq("user_id", userId),
      supabaseAdmin.from("focus_sessions").delete().eq("user_id", userId),
      supabaseAdmin.from("projects").delete().eq("user_id", userId),
      supabaseAdmin.from("categories").delete().eq("user_id", userId),
      supabaseAdmin.from("subscriptions").delete().eq("user_id", userId),
      supabaseAdmin.from("ai_usage").delete().eq("user_id", userId),
      supabaseAdmin.from("profiles").delete().eq("id", userId),
    ]);

    // 2. Delete user from auth schema
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteUserError) {
      console.error("Failed to delete auth user:", deleteUserError);
      throw new Error(`Failed to delete account auth record: ${deleteUserError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account and all associated personal data have been permanently deleted.",
        deletedUserId: userId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Account deletion exception:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
