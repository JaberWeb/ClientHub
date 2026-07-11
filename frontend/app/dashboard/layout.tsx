"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Users,
  UserPlus,
  FolderKanban,
  FolderPlus,
  DollarSign,
  FileText,
  Clock,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/dashboard/clients", icon: Users },
  { label: "Add Client", href: "/dashboard/clients/new", icon: UserPlus },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Add Project", href: "/dashboard/projects/new", icon: FolderPlus },
  { label: "Revenue", href: "/dashboard/revenue", icon: DollarSign },
  { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { label: "Pending Invoices", href: "/dashboard/pending-invoices", icon: Clock },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signup");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-18 items-center justify-between border-b border-slate-200 px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
              <BriefcaseBusiness className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">ClientHub</h1>
              <p className="-mt-0.5 text-[10px] tracking-widest text-slate-500">CRM</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex h-18 items-center gap-3 border-b border-slate-200 bg-white px-6 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <BriefcaseBusiness className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">ClientHub</span>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
