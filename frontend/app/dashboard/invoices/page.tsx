"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getInvoices, Invoice } from "@/services/invoice";
import {
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Loader2,
  Search,
} from "lucide-react";

const PAGE_LIMIT = 10;

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-600" },
};

export default function InvoicesPage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id ?? "";

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const result = await getInvoices({
        ownerId,
        status: statusFilter || undefined,
        page,
        limit: PAGE_LIMIT,
      });
      setInvoices(result.invoices);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [ownerId, statusFilter, page]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const startItem = (page - 1) * PAGE_LIMIT + 1;
  const endItem = Math.min(page * PAGE_LIMIT, total);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices</h1>
            <p className="mt-0.5 text-sm text-slate-500">{total} total invoices</p>
          </div>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Invoice
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">
              {statusFilter ? "No invoices match this status." : "No invoices yet."}
            </p>
            {!statusFilter && (
              <Link
                href="/dashboard/invoices/new"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create your first invoice
              </Link>
            )}
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
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Status</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Due</th>
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
                    const st = statusConfig[inv.status || "pending"] || statusConfig.pending;
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
                        <td className="px-6 py-4 text-slate-600">
                          {inv.client?.companyName || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {inv.project?.name || "—"}
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <span className={`inline-block rounded-xl px-2.5 py-1 text-xs font-medium ${st.color}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="hidden px-6 py-4 text-slate-500 lg:table-cell">
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
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
                <span className="font-medium text-slate-700">{total}</span> invoices
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
