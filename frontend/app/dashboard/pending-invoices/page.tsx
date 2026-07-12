"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getInvoices, Invoice } from "@/services/invoice";
import {
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const PAGE_LIMIT = 10;

export default function PendingInvoicesPage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id ?? "";

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const result = await getInvoices({ ownerId, status: "pending", page, limit: PAGE_LIMIT });
      setInvoices(result.invoices);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [ownerId, page]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const startItem = (page - 1) * PAGE_LIMIT + 1;
  const endItem = Math.min(page * PAGE_LIMIT, total);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pending Invoices</h1>
          <p className="mt-0.5 text-sm text-slate-500">{total} unpaid invoices</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">No pending invoices!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Invoice</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Client</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Project</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Due</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Days Overdue</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        Amount
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => {
                    const daysOverdue = inv.dueDate
                      ? Math.max(0, Math.floor((new Date().getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24)))
                      : 0;
                    return (
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
                        <td className="px-6 py-4 text-slate-600">{inv.project?.name || "—"}</td>
                        <td className="hidden px-6 py-4 text-slate-500 lg:table-cell">
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                        </td>
                        <td className="hidden px-6 py-4 lg:table-cell">
                          {daysOverdue > 0 ? (
                            <span className="font-medium text-red-600">{daysOverdue} days</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 lg:table-cell">
                          <span className="font-medium text-slate-900">
                            ${Number(inv.amount).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span> pending invoices
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
