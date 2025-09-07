import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Eye, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";

interface StickerPageProps {
  params: {
    id: string;
  };
}

export default async function StickerPage({ params }: StickerPageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch sticker data
  const { data: sticker, error } = await supabase
    .from("stickers")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error || !sticker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">
              Sticker Not Found
            </CardTitle>
            <CardDescription>
              This sticker doesn&apos;t exist or is not publicly available.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleScan = () => {
    // This will be handled by the scan API route
    window.location.href = `/api/stickers/${id}/scan`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{sticker.title}</CardTitle>
          {sticker.description && (
            <CardDescription className="text-base">
              {sticker.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sticker Preview */}
          <div className="flex justify-center">
            <div className="relative">
              {sticker.sticker_image_url ? (
                <Image
                  src={sticker.sticker_image_url}
                  alt={sticker.title}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Sticker Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Theme:</span>
              <Badge variant="secondary">{sticker.theme}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Scans:</span>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{sticker.scan_count}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Created:
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {new Date(sticker.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleScan}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visit Link</span>
            </button>

            <p className="text-xs text-center text-gray-500">
              Click the button above to visit the linked URL
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
