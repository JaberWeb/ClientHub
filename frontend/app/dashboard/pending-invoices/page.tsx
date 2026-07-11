import { Clock } from "lucide-react";

export default function PendingInvoicesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
          <Clock className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pending Invoices</h1>
          <p className="mt-0.5 text-sm text-slate-500">Unpaid invoices from clients.</p>
        </div>
      </div>
    </div>
  );
}
