import Link from "next/link";
import { ArrowLeft, FileX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-slate-50">
      <div className="mx-auto max-w-lg px-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <FileX className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">404</h1>
        <p className="mt-2 text-lg font-semibold text-slate-700">Page not found</p>
        <p className="mt-1 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
