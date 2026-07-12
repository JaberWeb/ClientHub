"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  FileText,
  Users,
  FolderKanban,
  DollarSign,
  Calendar,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { createInvoice } from "@/services/invoice";
import { getClients, Client } from "@/services/client";
import { getProjects, Project } from "@/services/project";
import { useSession } from "@/app/lib/auth-client";

type CreateInvoiceForm = {
  clientId: string;
  projectId: string;
  issueDate: string;
  dueDate: string;
  notes: string;
};

export default function NewInvoicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceForm>({
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
    },
  });

  const [error, setError] = useState<string | null>(null);
  const selectedClientId = watch("clientId");
  const selectedProjectId = watch("projectId");

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          getClients({ ownerId: session?.user?.id ?? "", limit: 999 }),
          getProjects({ ownerId: session?.user?.id ?? "", limit: 999 }),
        ]);
        const activeProjects = projectsRes.projects.filter((p) => p.status !== "completed");
        const eligibleIds = [...new Set(activeProjects.map((p) => p.clientId))];
        setClients(clientsRes.clients.filter((c) => eligibleIds.includes(c._id)));
        setProjects(activeProjects);
      } catch {
        // silently fail
      } finally {
        setClientsLoading(false);
      }
    }
    if (session?.user?.id) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    if (selectedClientId) {
      const filtered = projects.filter((p) => p.clientId === selectedClientId);
      setFilteredProjects(filtered);
      setValue("projectId", "");
      setSelectedAmount(0);
    } else {
      setFilteredProjects([]);
    }
  }, [selectedClientId, projects, setValue]);

  useEffect(() => {
    if (selectedProjectId) {
      const project = projects.find((p) => p._id === selectedProjectId);
      if (project) {
        setSelectedAmount(project.projectValue);
        if (!watch("dueDate") && project.dueDate) {
          setValue("dueDate", project.dueDate);
        }
      }
    } else {
      setSelectedAmount(0);
    }
  }, [selectedProjectId, projects, setValue, watch]);

  const onSubmit = async (data: CreateInvoiceForm) => {
    setError(null);
    try {
      await createInvoice({
        ownerId: session?.user?.id ?? "",
        clientId: data.clientId,
        projectId: data.projectId,
        amount: selectedAmount,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        notes: data.notes,
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/invoices"), 1500);
    } catch {
      setError("Failed to create invoice. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-10 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-emerald-900">Invoice created!</h2>
          <p className="mt-1 text-sm text-emerald-600">Redirecting to invoices list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/invoices"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Invoice</h1>
          <p className="mt-0.5 text-sm text-slate-500">Create an invoice for a client project.</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
          {/* Client & Project */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Client & Project</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-slate-700">
                  Client <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="clientId"
                    {...register("clientId", { required: "Please select a client." })}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">
                      {clientsLoading ? "Loading clients…" : "Select a client"}
                    </option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.clientId && (
                  <p className="mt-1 text-xs text-red-600">{errors.clientId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-slate-700">
                  Project <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <FolderKanban className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="projectId"
                    {...register("projectId", { required: "Please select a project." })}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    disabled={!selectedClientId}
                  >
                    <option value="">
                      {!selectedClientId ? "Select a client first" : "Select a project"}
                    </option>
                    {filteredProjects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — ${p.projectValue.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.projectId && (
                  <p className="mt-1 text-xs text-red-600">{errors.projectId.message}</p>
                )}
              </div>
            </div>

            {selectedProjectId && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {projects.find((p) => p._id === selectedProjectId)?.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {projects.find((p) => p._id === selectedProjectId)?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-slate-900">
                      ${selectedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Dates</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700">
                  Issue Date
                </label>
                <input
                  id="issueDate"
                  type="date"
                  {...register("issueDate")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
            </div>

            <div className="mt-5">
              <textarea
                id="notes"
                rows={3}
                {...register("notes")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Payment terms, additional notes…"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-8 py-5">
            <Link
              href="/dashboard/invoices"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
