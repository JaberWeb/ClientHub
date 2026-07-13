"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getProjectById, updateProjectStatus, deleteProject, Project } from "@/services/project";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  ArrowLeft,
  FolderKanban,
  DollarSign,
  Tag,
  Globe,
  Target,
  Key,
  Film,
  FileText,
  Calendar,
  Building2,
  Trash2,
  Loader2,
} from "lucide-react";

const statusColors: Record<string, string> = {
  ongoing: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<string, string> = {
  ongoing: "Ongoing",
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusOptions = ["ongoing", "pending", "completed", "cancelled"];

function statusDisplay(project: Project): { label: string; color: string } {
  if (project.dueDate && new Date(project.dueDate) < new Date() && project.status === "ongoing") {
    return { label: "Deadline Exceeded", color: "bg-red-100 text-red-700" };
  }
  const s = project.status || "ongoing";
  return { label: statusLabels[s] || "Ongoing", color: statusColors[s] || "bg-blue-100 text-blue-700" };
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch {
        setError("Project not found.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStatusChange = useCallback(async (newStatus: string) => {
    if (!project) return;
    try {
      const updated = await updateProjectStatus(project._id, newStatus);
      setProject(updated);
    } catch {
      // silently fail
    }
  }, [project]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      window.location.href = "/dashboard/projects";
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

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-sm text-slate-500">{error || "Project not found."}</p>
        <Link href="/dashboard/projects" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const sd = statusDisplay(project);
  const detailFields: { icon: typeof Globe; label: string; value: string | null }[] = [
    { icon: Globe, label: "Website", value: project.website || null },
    { icon: Film, label: "Media URL", value: project.mediaUrl || null },
    { icon: Target, label: "Target Audience", value: project.targetAudience || null },
    { icon: Key, label: "Credentials", value: project.credentials || null },
  ];
  const hasDetails = detailFields.some((f) => f.value);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="flex items-center gap-3">
          <span className={"inline-block rounded-xl px-2.5 py-1 text-xs font-medium " + sd.color}>
            {sd.label}
          </span>
          <select
            value={project.status || "ongoing"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none transition focus:border-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setDeleteTarget({ id: project._id, name: project.name })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
            <FolderKanban className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{project.name}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-200">
          <div className="px-8 py-7">
            <h2 className="text-sm font-semibold text-slate-900">General Information</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client</p>
                {project.client ? (
                  <Link href={`/dashboard/clients/${project.client._id}`} className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <Building2 className="h-3.5 w-3.5" />
                    {project.client.companyName}
                    <span className="text-slate-400 font-normal">({project.client.email})</span>
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-slate-400">—</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Type</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  {project.projectType ? (
                    <span className="inline-block rounded-xl bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{project.projectType}</span>
                  ) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Value</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  ${Number(project.projectValue).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Due Date</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                <p className="mt-1">
                  <span className={"inline-block rounded-xl px-2.5 py-1 text-xs font-medium " + sd.color}>
                    {sd.label}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {project.description && (
            <div className="px-8 py-7">
              <h2 className="text-sm font-semibold text-slate-900">Description</h2>
              <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-600 whitespace-pre-wrap">
                <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                {project.description}
              </p>
            </div>
          )}

          {hasDetails && (
            <div className="px-8 py-7">
              <h2 className="text-sm font-semibold text-slate-900">Details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {detailFields.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{f.label}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-900">
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        {f.value || "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Project"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.` : ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
