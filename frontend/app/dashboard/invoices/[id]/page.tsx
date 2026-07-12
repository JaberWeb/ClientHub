"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getInvoiceById, updateInvoiceStatus, Invoice } from "@/services/invoice";
import { getSettings, CompanySettings } from "@/services/settings";
import { useSession } from "@/app/lib/auth-client";
import {
  FileText,
  Printer,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Building2,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", color: "bg-emerald-100 text-emerald-700" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-600" },
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [invoiceData, settingsData] = await Promise.all([
          getInvoiceById(id),
          session?.user?.id ? getSettings(session.user.id) : Promise.resolve(null),
        ]);
        setInvoice(invoiceData);
        setSettings(settingsData);
      } catch {
        setError("Invoice not found.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, session?.user?.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleMarkPaid = async () => {
    try {
      const updated = await updateInvoiceStatus(id, "paid");
      setInvoice(updated);
    } catch {
      // silently fail
    }
  };

  const handleMarkCancelled = async () => {
    try {
      const updated = await updateInvoiceStatus(id, "cancelled");
      setInvoice(updated);
    } catch {
      // silently fail
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <p className="text-sm text-slate-500">{error || "Invoice not found."}</p>
        <Link href="/dashboard/invoices" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
      </div>
    );
  }

  const st = statusConfig[invoice.status || "pending"] || statusConfig.pending;
  const itemAmount = Number(invoice.amount);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Actions bar — hidden when printing */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/invoices"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <div className="flex items-center gap-3">
          {invoice.status === "pending" && (
            <>
              <button
                onClick={handleMarkPaid}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" />
                Mark Paid
              </button>
              <button
                onClick={handleMarkCancelled}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice Template — print-friendly */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm print:border-none print:shadow-none" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 px-8 py-8 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName}
                  className="h-9 w-9 rounded-xl object-contain"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="text-lg font-bold text-slate-900">
                {settings?.companyName || "ClientHub"}
              </span>
            </div>
            {settings && (settings.street || settings.city) && (
              <p className="mt-1 text-xs text-slate-400">
                {[settings.street, settings.city, settings.state, settings.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-400">CRM / Invoice</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-slate-900">{invoice.invoiceNumber}</h1>
            <span className={`mt-2 inline-block rounded-xl px-3 py-1 text-xs font-medium ${st.color}`}>
              {st.label}
            </span>
          </div>
        </div>

        {/* Bill To & Details */}
        <div className="grid gap-8 border-b border-slate-200 px-8 py-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bill To</h3>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {invoice.client?.companyName || "N/A"}
            </p>
            <p className="text-sm text-slate-600">{invoice.client?.contactPerson || ""}</p>
            <p className="text-sm text-slate-600">{invoice.client?.email || ""}</p>
          </div>
          <div className="sm:text-right">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Issue Date</h3>
                <p className="mt-0.5 text-sm text-slate-900">
                  {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Due Date</h3>
                <p className="mt-0.5 text-sm text-slate-900">
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-b border-slate-200 px-8 py-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Items</h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2 text-left text-xs font-semibold text-slate-500">Description</th>
                <th className="py-2 text-right text-xs font-semibold text-slate-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4">
                  <p className="font-medium text-slate-900">{invoice.project?.name || "Project"}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{invoice.project?.description || ""}</p>
                </td>
                <td className="py-4 text-right font-medium text-slate-900">
                  ${itemAmount.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td className="py-3 text-sm font-semibold text-slate-900">Total</td>
                <td className="py-3 text-right text-lg font-bold text-slate-900">
                  ${itemAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="px-8 py-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notes</h3>
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 px-8 py-5 text-center text-xs text-slate-400">
          Thank you for your business!
        </div>
      </div>

      <style jsx>{`
        @media print {
          @page {
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          :global(header) {
            display: none !important;
          }
          :global(footer) {
            display: none !important;
          }
          :global(aside) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
