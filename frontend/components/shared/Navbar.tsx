"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Menu, X, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "@/app/lib/auth-client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const isLoggedIn = !!session;

  const navLinks = [
    { label: "Home", href: "/" },
    ...(isLoggedIn ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <BriefcaseBusiness className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              ClientHub
            </h1>

            <p className="-mt-1 text-xs tracking-widest text-slate-500">
              CRM
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:border-red-300 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 md:hidden"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="flex flex-col px-6 py-5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-3 text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-5 flex flex-col gap-3">
              {isPending ? (
                <div className="flex justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                </div>
              ) : isLoggedIn ? (
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-medium text-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="rounded-xl border border-slate-200 py-3 text-center font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="rounded-xl bg-blue-600 py-3 text-center font-semibold text-white"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}