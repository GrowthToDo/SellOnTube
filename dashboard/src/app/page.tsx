"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-green-500 flex-shrink-0"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            SellOnTube
          </span>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 pt-24 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill badge */}
            <div
              className="animate-fade-in inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 mb-8"
            >
              <span className="text-sm font-medium text-blue-700">
                Free YouTube Analytics for SaaS Founders
              </span>
            </div>

            {/* Heading */}
            <h1
              className="animate-slide-up text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
            >
              Your YouTube channel,
              <br />
              <span className="gradient-text">crystal clear.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="animate-slide-up mt-6 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              Connect your channel in one click. See views, watch time, top
              videos, traffic sources, and search terms that drive your growth.
            </p>

            {/* CTA Button */}
            <div
              className="animate-slide-up mt-10"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              <button
                onClick={() =>
                  signIn("google", { callbackUrl: "/dashboard" })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Connect YouTube - It&apos;s Free
              </button>
            </div>

            {/* Trust note */}
            <p
              className="animate-slide-up mt-4 text-sm text-gray-400"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              Read-only access. We never post or modify your channel.
            </p>
          </div>
        </section>

        {/* Feature Preview Section */}
        <section className="bg-gray-50 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Real-time KPIs
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Views, watch time, subscribers, likes, and average duration at
                  a glance.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Traffic Intelligence
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  See exactly where your viewers come from and what they search
                  to find you.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="h-12 w-12 rounded-full bg-violet-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.63 6.023 6.023 0 01-2.77-.63"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Content Performance
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Rank your videos by views, retention, and engagement to double
                  down on winners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="px-6 py-10 border-t border-gray-100">
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-sm text-gray-500">Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-sm text-gray-500">Read-only access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-sm text-gray-500">No credit card</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 py-6 text-center text-sm text-gray-400">
        Built by{" "}
        <a
          href="https://sellontube.com"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          SellOnTube
        </a>
      </footer>
    </div>
  );
}
