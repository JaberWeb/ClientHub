"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getClients, Client } from "@/services/client";
import {
  Users,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Loader2,
} from "lucide-react";

const PAGE_LIMIT = 10;

export default function ClientsPage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id ?? "";

  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const result = await getClients({ ownerId, search: search || undefined, page, limit: PAGE_LIMIT });
      setClients(result.clients);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [ownerId, search, page]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounce search — reset to page 1 after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const startItem = (page - 1) * PAGE_LIMIT + 1;
  const endItem = Math.min(page * PAGE_LIMIT, total);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
            <p className="mt-0.5 text-sm text-slate-500">{total} total clients</p>
          </div>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, contact, or email…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : clients.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">
              {search ? "No clients match your search." : "No clients yet."}
            </p>
            {!search && (
              <Link
                href="/dashboard/clients/new"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add your first client
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        Company
                      </span>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </span>
                    </th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Phone
                      </span>
                    </th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Industry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((client, i) => (
                    <tr
                      key={client._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-xs text-slate-400">{startItem + i}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">{client.companyName}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{client.contactPerson}</td>
                      <td className="px-6 py-4 text-slate-500">{client.email}</td>
                      <td className="hidden px-6 py-4 text-slate-500 md:table-cell">{client.phone || "—"}</td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        {client.industry ? (
                          <span className="inline-block rounded-xl bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {client.industry}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span> clients
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
