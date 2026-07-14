"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getDashboardStats } from "@/services/dashboard";
import type { Invoice } from "@/services/invoice";
import {
  BriefcaseBusiness,
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  Clock,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id ?? "";

  const [revenue, setRevenue] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [activeProjectCount, setActiveProjectCount] = useState(0);
  const [deadlineCount, setDeadlineCount] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!ownerId) return;
      try {
        const stats = await getDashboardStats(ownerId);
        setClientCount(stats.totalClients);
        setProjectCount(stats.totalProjects);
        setActiveProjectCount(stats.activeProjects);
        setRevenue(stats.totalRevenue);
        setDeadlineCount(stats.overdueInvoices);
        setRecentInvoices(stats.recentInvoices);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ownerId]);

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const activityConfig: Record<string, { label: string; badge: string; color: string }> = {
    paid: { label: "Invoice paid", badge: "Paid", color: "bg-emerald-100 text-emerald-700" },
    pending: { label: "Invoice sent", badge: "Sent", color: "bg-blue-100 text-blue-700" },
    overdue: { label: "Payment overdue", badge: "Overdue", color: "bg-red-100 text-red-700" },
    cancelled: { label: "Invoice cancelled", badge: "Cancelled", color: "bg-slate-100 text-slate-600" },
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Revenue</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(revenue)}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs text-slate-500">total paid</span>
          </div>
        </div>

        {/* Clients */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Clients</span>
            <Users className="h-4 w-4 text-teal-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{clientCount}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs text-slate-500">total clients</span>
          </div>
        </div>

        {/* Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Projects</span>
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{projectCount}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-medium text-emerald-500">{activeProjectCount}</span>
            <span className="text-xs text-slate-400">active</span>
          </div>
        </div>

        {/* Deadlines */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Deadlines</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{deadlineCount}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-medium text-amber-500">{deadlineCount}</span>
            <span className="text-xs text-slate-400">overdue</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Recent Activity
            </span>
          </div>
          <span className="text-xs text-slate-400">
            <Link href="/dashboard/invoices" className="text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </span>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">No activity yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentInvoices.map((inv) => {
              const activity = activityConfig[inv.status || "pending"] || activityConfig.pending;
              return (
                <Link
                  key={inv._id}
                  href={`/dashboard/invoices/${inv._id}`}
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100">
                      <span className="text-xs font-bold text-teal-700">
                        {(inv.client?.companyName || "?").charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {inv.client?.companyName || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">{activity.label}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-xl px-2 py-0.5 text-xs font-medium ${activity.color}`}
                  >
                    {activity.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
