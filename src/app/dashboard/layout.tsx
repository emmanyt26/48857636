"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">SK System</h1>
          <p className="text-gray-400 text-sm mt-1">Sangguniang Kabataan</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="mb-6">
            <p className="text-gray-400 text-xs font-semibold uppercase px-4 mb-3">
              Main
            </p>
            <Link
              href="/dashboard/officials"
              className={`flex items-center px-4 py-2 rounded transition ${
                isActive("/dashboard/officials")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20h-8m0 0l-1.5-3m0 0L5 20m0 0H2"
                />
              </svg>
              Officials
            </Link>
          </div>

          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase px-4 mb-3">
              Other
            </p>
            <Link
              href="/dashboard/events"
              className={`flex items-center px-4 py-2 rounded transition ${
                isActive("/dashboard/events")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Events
            </Link>
            <Link
              href="/dashboard/audit"
              className={`flex items-center px-4 py-2 rounded transition ${
                isActive("/dashboard/audit")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Audit Logs
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs">© 2026 SK System</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
