import { FileText } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices</h1>
          <p className="mt-0.5 text-sm text-slate-500">All invoices at a glance.</p>
        </div>
      </div>
    </div>
  );
}
