"use client";

import { signOut, useSession } from "next-auth/react";

function getInitial(name?: string | null): string {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

interface SidebarProps {
  onFeedbackClick?: () => void;
}

export default function Sidebar({ onFeedbackClick }: SidebarProps) {
  const { data: session } = useSession();

  return (
    <aside className="w-60 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <span className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="flex items-center justify-center h-6 w-6 rounded bg-red-600 text-[10px] font-bold text-white leading-none">
            YT
          </span>
          SellOnTube
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <a
          href="/dashboard"
          className="relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white bg-gray-800/70"
        >
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-500"
            aria-hidden="true"
          />
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
          </svg>
          Analytics
        </a>

        <button
          onClick={onFeedbackClick}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors w-full"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          Feature Request
        </button>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-3">
        {session?.user && (
          <div className="flex items-center gap-3 px-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shrink-0">
              {getInitial(session.user.name)}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center justify-center gap-1.5 w-full rounded-md px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
