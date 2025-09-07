"use client";

import { useEffect, useState } from "react";
import { generateQRCode, formatURL, validateURL } from "@/lib/qr-code";
import { predefinedStyles, StickerStyle } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  QrCode,
  Sparkles,
  Download,
  Loader2,
  Check,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CreateStickerPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
  });

  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>(
    predefinedStyles.modern
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedSticker, setGeneratedSticker] = useState<string | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");

    // Auto-suggest style based on description
    if (field === "description" && value) {
      const lowerDesc = value.toLowerCase();
      if (
        lowerDesc.includes("bold") ||
        lowerDesc.includes("vibrant") ||
        lowerDesc.includes("bright") ||
        lowerDesc.includes("colorful") ||
        lowerDesc.includes("gaming") ||
        lowerDesc.includes("esports")
      ) {
        setSelectedStyle(predefinedStyles.bold);
      } else if (
        lowerDesc.includes("classic") ||
        lowerDesc.includes("vintage") ||
        lowerDesc.includes("retro") ||
        lowerDesc.includes("traditional") ||
        lowerDesc.includes("elegant")
      ) {
        setSelectedStyle(predefinedStyles.classic);
      } else {
        // Default to modern for most cases
        setSelectedStyle(predefinedStyles.modern);
      }
    }
  };

  const handleGenerateQR = async () => {
    if (!formData.url.trim()) {
      setError("Please enter a URL");
      return;
    }

    const formattedURL = formatURL(formData.url);
    if (!validateURL(formattedURL)) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      const qrCode = await generateQRCode(formattedURL, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataURL(qrCode);
      setFormData((prev) => ({ ...prev, url: formattedURL }));
    } catch {
      setError("Failed to generate QR code");
    }
  };

  const handleGenerateSticker = async () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      setError(
        "You have reached the maximum number of attempts for today. Try again in 24 hours."
      );
      return;
    }

    if (loading) return; // Prevent multiple submissions

    if (!admin && attempts >= 3) {
      setError("You have reached the maximum number of attempts.");
      return;
    }

    setAttempts((prev) => prev + 1); // increment attempts
    setLoading(true);
    setError("");
    setSuccess(false);

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Generate QR code if it doesn't exist
      let finalQrCodeDataURL = qrCodeDataURL;
      if (!finalQrCodeDataURL) {
        const formattedURL = formatURL(formData.url);
        if (!validateURL(formattedURL)) {
          setError("Please enter a valid URL");
          return;
        }

        const qrCode = await generateQRCode(formattedURL, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        finalQrCodeDataURL = qrCode;
        setQrCodeDataURL(qrCode);
        setFormData((prev) => ({ ...prev, url: formattedURL }));
      }

      const response = await fetch("/api/stickers/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          url: formData.url,
          styleKey: Object.keys(predefinedStyles).find(
            (key) => predefinedStyles[key].theme === selectedStyle.theme
          ),
          qrCodeDataURL: finalQrCodeDataURL,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate sticker");
      }

      const data = await response.json();
      setGeneratedSticker(data.sticker.sticker_image_url);

      // Show success message since the sticker is already saved
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate sticker. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedSticker) return;

    const link = document.createElement("a");
    link.href = generatedSticker;
    link.download = `${formData.title.replace(/\s+/g, "_")}_sticker.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const admin = true;
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!admin) {
      const storedAttempts = localStorage.getItem("sticker_attempts");
      const storedTimestamp = localStorage.getItem("sticker_attempts_time");

      if (storedAttempts && storedTimestamp) {
        const attemptsCount = parseInt(storedAttempts, 10);
        const lastTime = parseInt(storedTimestamp, 10);
        const now = Date.now();

        // If 24 hrs passed → reset
        if (now - lastTime >= 24 * 60 * 60 * 1000) {
          setAttempts(0);
          localStorage.removeItem("sticker_attempts");
          localStorage.removeItem("sticker_attempts_time");
        } else {
          setAttempts(attemptsCount);
        }
      }
    }
  }, [admin]);

  useEffect(() => {
    if (!admin && attempts > 0) {
      localStorage.setItem("sticker_attempts", attempts.toString());
      localStorage.setItem("sticker_attempts_time", Date.now().toString());
    }
  }, [attempts, admin]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <QrCode className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Create QR Sticker</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sticker Details</CardTitle>
                <CardDescription>
                  Enter the information for your QR code sticker
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter sticker title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., 'Professional business card sticker for my company'"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500">
                    💡 Tip: Describe your brand or business type. Use words like
                    &quot;bold&quot;, &quot;classic&quot;, or &quot;modern&quot;
                    to auto-suggest the best style!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      onClick={handleGenerateQR}
                      disabled={loading || !formData.url.trim()}
                      variant="outline"
                      title="Preview QR code (optional)"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    QR code will be generated automatically when creating the
                    sticker
                  </p>
                </div>

                {qrCodeDataURL && (
                  <div className="space-y-2">
                    <Label>QR Code Preview</Label>
                    <div className="flex justify-center p-4 bg-white rounded-lg border">
                      <Image
                        src={qrCodeDataURL}
                        alt="QR Code"
                        width={128}
                        height={128}
                        className="w-32 h-32"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Style</CardTitle>
                <CardDescription>
                  Select a design theme for your sticker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(predefinedStyles).map(([key, style]) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedStyle.theme === style.theme
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedStyle(style)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: style.colors[0] }}
                          />
                          <span className="font-medium text-sm">
                            {style.theme}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {style.colors.slice(0, 4).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">{style.mood}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateSticker}
              disabled={
                loading ||
                !formData.title.trim() ||
                !formData.url.trim() ||
                (!admin && attempts >= 3)
              }
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate & Save Sticker
            </Button>
            {attempts >= 3 ? <p>{error}</p> : ""}
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sticker Preview</CardTitle>
                <CardDescription>
                  Your AI-generated QR code sticker will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedSticker ? (
                  <div className="space-y-4">
                    {success && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-green-600 mb-2">
                          <Check className="h-5 w-5" />
                          <span className="font-medium">
                            Sticker Created Successfully!
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          Your QR sticker has been saved to your dashboard.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-center p-4 bg-white rounded-lg border">
                      <Image
                        src={generatedSticker}
                        alt="Generated Sticker"
                        width={400}
                        height={400}
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Link href="/dashboard" className="flex-1">
                          <Button className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View Dashboard
                          </Button>
                        </Link>
                      </div>
                      <Button
                        onClick={() => {
                          setGeneratedSticker(null);
                          setSuccess(false);
                          setFormData({ title: "", description: "", url: "" });
                          setQrCodeDataURL(null);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Another Sticker
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <QrCode className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      Generate a QR code and sticker to see the preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Style Info */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Theme</Label>
                    <p className="text-sm text-gray-600">
                      {selectedStyle.theme}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Colors</Label>
                    <div className="flex space-x-2 mt-1">
                      {selectedStyle.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Style</Label>
                    <p className="text-sm text-gray-600">
                      {selectedStyle.style}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Mood</Label>
                    <p className="text-sm text-gray-600">
                      {selectedStyle.mood}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
