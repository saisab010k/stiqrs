import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQRCode, formatURL, validateURL } from "@/lib/qr-code";
import { generateStickerImage, predefinedStyles } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, styleKey, qrCodeDataURL } = body;

    // Validate input
    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const formattedURL = formatURL(url);
    if (!validateURL(formattedURL)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Get style
    const style = predefinedStyles[styleKey] || predefinedStyles.modern;

    // Use provided QR code or generate new one
    let finalQrCodeDataURL = qrCodeDataURL;
    if (!finalQrCodeDataURL) {
      finalQrCodeDataURL = await generateQRCode(formattedURL, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    }

    // Generate sticker image
    const stickerImage = await generateStickerImage({
      url: formattedURL,
      title,
      description,
      style,
      qrCodeDataURL: finalQrCodeDataURL,
    });

    // Save to database
    const { data: sticker, error: dbError } = await supabase
      .from("stickers")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        url: formattedURL,
        qr_code_data: finalQrCodeDataURL,
        sticker_image_url: stickerImage,
        theme: style.theme,
        style_preferences: style,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save sticker" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sticker: {
        id: sticker.id,
        title: sticker.title,
        description: sticker.description,
        url: sticker.url,
        qr_code_data: sticker.qr_code_data,
        sticker_image_url: sticker.sticker_image_url,
        theme: sticker.theme,
        created_at: sticker.created_at,
      },
    });
  } catch (error) {
    console.error("Error generating sticker:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
