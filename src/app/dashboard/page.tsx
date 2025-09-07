"use client";

import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  QrCode,
  Download,
  Trash2,
  Loader2,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Sticker {
  id: string;
  title: string;
  description: string | null;
  url: string;
  qr_code_data: string;
  sticker_image_url: string;
  theme: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loadingStickers, setLoadingStickers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchStickers = async () => {
        try {
          setLoadingStickers(true);
          setError("");
          const { data, error } = await supabase
            .from("stickers")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Error fetching stickers:", error);
            setError("Failed to load stickers");
            return;
          }

          setStickers(data || []);
        } catch (error) {
          console.error("Error fetching stickers:", error);
          setError("Failed to load stickers");
        } finally {
          setLoadingStickers(false);
        }
      };

      fetchStickers();
    }
  }, [user, loading, router, supabase]);

  const handleDeleteSticker = async (stickerId: string) => {
    if (!confirm("Are you sure you want to delete this sticker?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("stickers")
        .delete()
        .eq("id", stickerId);

      if (error) {
        console.error("Error deleting sticker:", error);
        setError("Failed to delete sticker");
        return;
      }

      setStickers(stickers.filter((sticker) => sticker.id !== stickerId));
    } catch (error) {
      console.error("Error deleting sticker:", error);
      setError("Failed to delete sticker");
    }
  };

  const handleDownload = (sticker: Sticker) => {
    const link = document.createElement("a");
    link.href = sticker.sticker_image_url;
    link.download = `${sticker.title.replace(/\s+/g, "_")}_sticker.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <QrCode className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">QR Sticker Magic</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-gray-600">
                  {profile?.full_name || user.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your QR code stickers</p>
          </div>
          <Link href="/dashboard/create">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create New Sticker
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stickers Grid */}
        {loadingStickers ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading stickers...</span>
          </div>
        ) : stickers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No stickers yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first QR code sticker to get started
              </p>
              <Link href="/dashboard/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Sticker
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stickers.map((sticker) => (
              <Card key={sticker.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <Image
                    src={sticker.sticker_image_url}
                    alt={sticker.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{sticker.title}</CardTitle>
                      {sticker.description && (
                        <CardDescription className="mt-1">
                          {sticker.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary">{sticker.theme}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p className="truncate">
                        <strong>URL:</strong> {sticker.url}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(sticker.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(sticker)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSticker(sticker.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
