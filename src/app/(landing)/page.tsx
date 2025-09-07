"use client";
import { ReactLenis } from "lenis/react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { QrCode, Sparkles, Users, Zap } from "lucide-react";
import Image from "next/image";
import ImageMouseTrail from "@/components/ui/mousetrail";

const qrImages = [
  "/stiqr/01.png",
  "/stiqr/02.jpg",
  "/stiqr/03.jpeg",
  "/stiqr/04.png",
  "/stiqr/05.png",
];

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ReactLenis root>
      <main className="bg-black">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  width={120}
                  height={40}
                  alt="stiqrs logo"
                />
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-gray-800"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="wrapper">
          {/* Hero Section */}
          <section className="text-white h-screen w-full bg-slate-950 grid place-content-center sticky top-0">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="text-center px-8">
              <h1 className="2xl:text-7xl text-6xl font-semibold tracking-tight leading-[120%] mb-8">
                Create Stunning QR Code
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {" "}
                  Stickers{" "}
                </span>
                with AI Magic ✨
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Transform any URL into beautiful, personalized QR code stickers
                using AI-powered design. Perfect for lost & found, marketing,
                and brand promotion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={user ? "/dashboard" : "/register"}>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Creating
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Interactive Mouse Trail Section */}
          <section className="bg-gray-900 text-white grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <ImageMouseTrail
              items={qrImages}
              maxNumberOfImages={5}
              distance={25}
              imgClass="sm:w-40 w-28 sm:h-48 h-36"
              className="bg-gray-900"
            >
              <article className="relative z-50 mix-blend-difference">
                <h1 className="lg:text-4xl md:text-3xl text-xl text-center font-semibold mix-blend-difference">
                  ✨ Customize your QR <br />
                  with your own stickers
                </h1>
              </article>
            </ImageMouseTrail>
          </section>

          {/* Features Section */}
          <section className="text-white h-screen w-full bg-slate-950 grid place-content-center sticky top-0">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="text-center px-8 max-w-6xl mx-auto">
              <h1 className="2xl:text-7xl text-5xl font-semibold text-center tracking-tight leading-[120%] mb-12">
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  stiqrs
                </span>
                ?
              </h1>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    AI-Powered Design
                  </h3>
                  <p className="text-gray-300">
                    Generate unique, eye-catching designs using Gemini&apos;s
                    advanced AI. No design skills required!
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Instant Generation
                  </h3>
                  <p className="text-gray-300">
                    Create professional QR stickers in seconds. Upload your URL
                    and watch the magic happen.
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Multiple Use Cases
                  </h3>
                  <p className="text-gray-300">
                    Perfect for lost & found tags, marketing campaigns, business
                    promotion, and social media.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <section className="text-white w-full bg-slate-950">
          <div className="grid grid-cols-2 px-8">
            <div className="grid gap-2">
              <figure className="sticky top-0 h-screen grid place-content-center">
                <Image
                  alt="image"
                  height={250}
                  width={250}
                  src="/01.png"
                ></Image>
                <Image
                  alt="image"
                  height={250}
                  width={250}
                  src="/02.png"
                ></Image>
                <Image
                  alt="image"
                  height={250}
                  width={250}
                  src="/03.png"
                ></Image>
              </figure>
            </div>
            <div className="sticky top-0 h-screen grid place-content-center">
              <div className="text-center px-8">
                <h1 className="text-4xl font-medium text-right tracking-tight leading-[120%] mb-6">
                  Ready to Create Your First
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    QR Sticker?
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 text-right">
                  Join thousands of users creating amazing QR stickers with AI
                  magic.
                </p>
                <Link href={user ? "/dashboard" : "/register"}>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started Free
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="group bg-slate-950">
          <h1 className="text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all ease-linear">
            stiqrs
          </h1>
          <section className="bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <QrCode className="h-6 w-6" />
                <span className="text-lg font-semibold">stiqrs</span>
              </div>
              <p className="text-gray-400">
                © 2025 stiqrs. All rights reserved.
              </p>
            </div>
          </section>
        </footer>
      </main>
    </ReactLenis>
  );
}
