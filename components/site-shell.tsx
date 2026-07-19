"use client";
import Link from "next/link";
import {
  BookOpen,
  LayoutDashboard,
  Moon,
  Search,
  Settings2,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/problems", label: "Problems", icon: BookOpen },
  { href: "/admin", label: "Admin", icon: Settings2 },
];
export function SiteShell({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-[#0b1020]/80">
        <div className="shell flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
              ⌘
            </span>
            DSA Vault
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Icon className="mr-1 inline size-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/problems"
              aria-label="Search problems"
              className="grid size-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="size-4" />
            </Link>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="grid size-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {ready && theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
          </div>
        </div>
      </header>
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-white/95 py-2 backdrop-blur md:hidden dark:bg-slate-950/95">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-4 text-xs text-slate-500"
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
