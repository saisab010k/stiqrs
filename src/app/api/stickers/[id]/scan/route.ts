import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: stickerId } = await params;

    // Get client information
    const userAgent = request.headers.get("user-agent") || "";
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "";

    // Record the scan
    const { error: analyticsError } = await supabase
      .from("sticker_analytics")
      .insert({
        sticker_id: stickerId,
        user_agent: userAgent,
        ip_address: ip,
        referrer: request.headers.get("referer") || null,
      });

    if (analyticsError) {
      console.error("Analytics error:", analyticsError);
    }

    // Update scan count
    const { data: currentSticker, error: fetchError } = await supabase
      .from("stickers")
      .select("scan_count")
      .eq("id", stickerId)
      .single();

    if (!fetchError && currentSticker) {
      const { error: updateError } = await supabase
        .from("stickers")
        .update({
          scan_count: (currentSticker.scan_count || 0) + 1,
        })
        .eq("id", stickerId);

      if (updateError) {
        console.error("Update error:", updateError);
      }
    }

    // Get sticker URL for redirect
    const { data: sticker, error: stickerFetchError } = await supabase
      .from("stickers")
      .select("url")
      .eq("id", stickerId)
      .single();

    if (stickerFetchError || !sticker) {
      return NextResponse.json({ error: "Sticker not found" }, { status: 404 });
    }

    // Redirect to the sticker's URL
    return NextResponse.redirect(sticker.url);
  } catch (error) {
    console.error("Error processing scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
