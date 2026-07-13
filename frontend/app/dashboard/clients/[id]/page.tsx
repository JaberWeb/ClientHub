"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getClientById, deleteClient, Client } from "@/services/client";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  MapPin,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientById(id);
        setClient(data);
      } catch {
        setError("Client not found.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      window.location.href = "/dashboard/clients";
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-sm text-slate-500">{error || "Client not found."}</p>
        <Link href="/dashboard/clients" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </div>
    );
  }

  const addressParts = [client.street, client.city, client.state, client.zip, client.country].filter(Boolean);
  const hasAddress = addressParts.length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        <button
          type="button"
          onClick={() => setDeleteTarget({ id: client._id, name: client.companyName })}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete Client
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
            <Building2 className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{client.companyName}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Client since {new Date(client.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-200">
          <div className="px-8 py-7">
            <h2 className="text-sm font-semibold text-slate-900">General Information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact Person</p>
                <p className="mt-1 text-sm text-slate-900">{client.contactPerson}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {client.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {client.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Website</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  {client.website ? (
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{client.website}</a>
                  ) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Industry</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  {client.industry ? (
                    <span className="inline-block rounded-xl bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{client.industry}</span>
                  ) : "—"}
                </p>
              </div>
            </div>
          </div>

          {hasAddress && (
            <div className="px-8 py-7">
              <h2 className="text-sm font-semibold text-slate-900">Address</h2>
              <div className="mt-5">
                <p className="flex items-center gap-1.5 text-sm text-slate-900">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {addressParts.join(", ")}
                </p>
              </div>
            </div>
          )}

          {client.notes && (
            <div className="px-8 py-7">
              <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
              <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-600 whitespace-pre-wrap">
                <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                {client.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Client"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
