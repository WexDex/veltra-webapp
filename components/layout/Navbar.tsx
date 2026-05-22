"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import VeltraLogo from "@/components/ui/VeltraLogo";
import { cn } from "@/lib/utils";
import { DbNotification } from "@/lib/types";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setSession(data); setSessionLoaded(true); });
  }, [pathname]);

  useEffect(() => {
    if (!session) { setNotifications([]); setUnreadCount(0); return; }
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) { setNotifications(data.notifications); setUnreadCount(data.unreadCount); }
      });
  }, [session, pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  };

  const openNotifications = async () => {
    setNotifOpen((o) => !o);
    setProfileOpen(false);
    if (unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await fetch("/api/notifications/read", { method: "POST", body: "{}" });
    }
  };

  const notifMeta = (n: DbNotification): { label: string; href?: string } => {
    if (n.type === "friend_request") return { label: `${n.fromUser?.name ?? "Someone"} sent you a friend request`, href: "/chat" };
    if (n.type === "friend_accepted") return { label: `${n.fromUser?.name ?? "Someone"} accepted your friend request` };
    if (n.type === "new_message") return { label: `${n.fromUser?.name ?? "Someone"} sent you a message`, href: n.fromUser ? `/chat/${n.fromUser.id}` : "/chat" };
    if (n.type === "new_contact") return { label: "New contact form submission", href: "/admin/dashboard" };
    return { label: "New notification" };
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <VeltraLogo size={24} />
          <span className="font-semibold text-gray-100 text-lg tracking-tight">Veltra</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-gray-100 bg-gray-800"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          {session?.role === "admin" && (
            <>
              <div className="w-px h-4 bg-gray-700 mx-1" />
              <Link
                href="/api-docs"
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/api-docs"
                    ? "text-purple-400 bg-purple-700/15"
                    : "text-purple-400/70 hover:text-purple-400 hover:bg-purple-700/15"
                )}
              >
                API
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {sessionLoaded && session?.role === "admin" && (
            <div className="hidden md:flex items-center gap-0.5 rounded-lg bg-gray-800/60 border border-gray-700 p-0.5">
              <span className="px-3 py-1 rounded-md bg-gray-700 text-gray-100 text-xs font-semibold">
                User
              </span>
              <Link
                href="/admin/dashboard"
                className="px-3 py-1 rounded-md text-gray-400 hover:text-gray-200 text-xs font-semibold transition-colors"
              >
                Admin
              </Link>
            </div>
          )}
          {sessionLoaded && (
            session ? (
              <>
                {/* Notification Bell */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={openNotifications}
                    className="relative p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors cursor-pointer"
                    aria-label="Notifications"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                        <span className="text-sm font-semibold text-gray-100">Notifications</span>
                        <Link
                          href="/notifications"
                          onClick={() => setNotifOpen(false)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.slice(0, 5).length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.slice(0, 5).map((n) => {
                            const { label, href } = notifMeta(n);
                            const inner = (
                              <>
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-300 shrink-0">
                                  {n.fromUser ? getInitials(n.fromUser.name) : "✉"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-200 leading-snug">{label}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{timeAgo(n.created_at)}</p>
                                </div>
                                {!n.read && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                )}
                              </>
                            );
                            const cls = cn(
                              "flex items-start gap-3 px-4 py-3 border-b border-gray-800 last:border-0",
                              !n.read && "bg-blue-700/5",
                              href && "hover:bg-gray-800/60 transition-colors"
                            );
                            return href ? (
                              <Link key={n.id} href={href} onClick={() => setNotifOpen(false)} className={cls}>
                                {inner}
                              </Link>
                            ) : (
                              <div key={n.id} className={cls}>{inner}</div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Chip */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {getInitials(session.name)}
                    </div>
                    <span className="hidden md:block text-sm text-gray-200 font-medium max-w-30 truncate">
                      {session.name}
                    </span>
                    <svg className="hidden md:block w-3.5 h-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-sm font-semibold text-gray-100 truncate">{session.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.email}</p>
                        <span className={cn(
                          "inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          session.role === "admin" ? "bg-blue-700/20 text-blue-400" : "bg-gray-700/50 text-gray-400"
                        )}>
                          {session.role === "admin" ? "Admin" : "User"}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/chat"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          People
                        </Link>
                        <Link
                          href="/messages"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          Messages
                        </Link>
                        <Link
                          href="/notifications"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                          Notifications
                        </Link>
                        {session.role === "admin" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
                            </svg>
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-800 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden md:inline-flex text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="hidden md:inline-flex items-center px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )
          )}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              {mobileOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 pb-4 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-gray-100 bg-gray-800"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/60"
              )}
            >
              {link.label}
            </Link>
          ))}
          {session?.role === "admin" && (
            <>
              <div className="h-px bg-gray-800 mt-1" />
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-blue-400/80 hover:text-blue-400 hover:bg-blue-700/10 transition-colors"
              >
                Switch to Admin View
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/api-docs"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === "/api-docs"
                    ? "text-purple-400 bg-purple-700/15"
                    : "text-purple-400/70 hover:text-purple-400 hover:bg-purple-700/15"
                )}
              >
                API Docs
              </Link>
            </>
          )}
          <div className="flex gap-3 pt-2 border-t border-gray-800 mt-2">
            {session ? (
              <button
                onClick={handleLogout}
                className="flex-1 text-center py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex-1 text-center py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 text-center py-2 rounded-lg bg-blue-700 text-white text-sm hover:bg-blue-800 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
