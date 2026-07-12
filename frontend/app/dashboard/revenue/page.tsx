"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getInvoices, Invoice } from "@/services/invoice";
import { getProjects, Project } from "@/services/project";
import {
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const PAGE_LIMIT = 10;

export default function RevenuePage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id ?? "";

  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [receivedRevenue, setReceivedRevenue] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [upcomingRevenue, setUpcomingRevenue] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const [tableResult, allPaidResult, ongoingResult] = await Promise.all([
        getInvoices({ ownerId, status: "paid", page, limit: PAGE_LIMIT }),
        getInvoices({ ownerId, status: "paid", page: 1, limit: 9999 }),
        getProjects({ ownerId, status: "ongoing", limit: 9999 }),
      ]);

      setPaidInvoices(tableResult.invoices);
      setTotal(tableResult.total);
      setTotalPages(tableResult.totalPages);

      setReceivedRevenue(
        allPaidResult.invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
      );
      setPaidCount(allPaidResult.total);

      setUpcomingRevenue(
        ongoingResult.projects.reduce((sum, p) => sum + Number(p.projectValue || 0), 0)
      );
      setOngoingCount(ongoingResult.total);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [ownerId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startItem = (page - 1) * PAGE_LIMIT + 1;
  const endItem = Math.min(page * PAGE_LIMIT, total);

  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <DollarSign className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Revenue</h1>
          <p className="mt-0.5 text-sm text-slate-500">Track your earnings and growth.</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Upcoming Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Upcoming Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : formatCurrency(upcomingRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {loading ? "Loading…" : `from ${ongoingCount} ongoing project${ongoingCount !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Received Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Received Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : formatCurrency(receivedRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {loading ? "Loading…" : `from ${paidCount} paid invoice${paidCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Paid invoices table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : paidInvoices.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <DollarSign className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">No paid invoices yet.</p>
            <p className="mt-1 text-xs text-slate-500">
              Invoices marked as paid will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Invoice</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Client</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Project</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Issue Date</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        Amount
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paidInvoices.map((inv) => (
                    <tr key={inv._id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/invoices/${inv._id}`}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{inv.client?.companyName || "—"}</td>
                      <td className="hidden px-6 py-4 text-slate-600 md:table-cell">{inv.project?.name || "—"}</td>
                      <td className="hidden px-6 py-4 text-slate-500 lg:table-cell">
                        {inv.issueDate ? new Date(inv.issueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          ${Number(inv.amount).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span> paid invoices
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 px-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="inline-flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-1 text-xs text-slate-300">…</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${
                          p === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 px-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
