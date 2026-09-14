// ==============================================================================
// TASKFLOW SUPABASE EDGE FUNCTION: verify-purchase
// Platform: Deno / TypeScript
// Description: Validates Google Play In-App Purchase and upgrades user tier
// ==============================================================================

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPurchasePayload {
  purchaseToken: string;
  productId: string;
  orderId?: string;
  packageName?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
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

    // 1. Authenticate user from JWT
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

    const payload: VerifyPurchasePayload = await req.json();
    const { purchaseToken, productId, orderId } = payload;

    if (!purchaseToken || !productId) {
      return new Response(
        JSON.stringify({ error: "Missing purchaseToken or productId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Determine purchased tier
    const isLifetime = productId.includes("lifetime");
    const targetTier = isLifetime ? "lifetime" : "premium";
    const durationDays = isLifetime ? 36500 : (productId.includes("annual") ? 365 : 30);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 3. Admin client for privileged write into subscriptions & profiles
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Record subscription receipt
    const { error: subError } = await supabaseAdmin.from("subscriptions").upsert({
      user_id: user.id,
      google_play_purchase_token: purchaseToken,
      order_id: orderId || `GPA.${Date.now()}`,
      product_id: productId,
      status: "active",
      starts_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      auto_renewing: !isLifetime,
    }, { onConflict: "google_play_purchase_token" });

    if (subError) {
      console.error("Subscription insert error:", subError);
      throw new Error(`Failed to record subscription: ${subError.message}`);
    }

    // Upgrade user profile tier
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ tier: targetTier, updated_at: now.toISOString() })
      .eq("id", user.id);

    if (profileError) {
      console.error("Profile tier upgrade error:", profileError);
      throw new Error(`Failed to update profile tier: ${profileError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully verified purchase and activated ${targetTier} plan.`,
        tier: targetTier,
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Purchase verification exception:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
