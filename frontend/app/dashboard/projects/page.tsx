"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";
import { getProjects, updateProjectStatus, deleteProject, Project } from "@/services/project";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  FolderKanban,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  DollarSign,
  Tag,
  Trash2,
  Filter,
  ArrowUpDown,
  X,
  Loader2,
} from "lucide-react";

const PAGE_LIMIT = 10;

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

export default function ProjectsPage() {
  const { data: session } = useSession();

  const ownerId = session?.user?.id ?? "";
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortValue, setSortValue] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const result = await getProjects({ ownerId, search: search || undefined, status: statusFilter || undefined, sort: sortValue !== "newest" ? sortValue : undefined, page, limit: PAGE_LIMIT });
      setProjects(result.projects);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [ownerId, search, statusFilter, sortValue, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    setStatusUpdating(projectId);
    try {
      await updateProjectStatus(projectId, newStatus);
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, status: newStatus } : p))
      );
    } catch {
      // silently fail
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setDeleteTarget(null);
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  const startItem = (page - 1) * PAGE_LIMIT + 1;
  const endItem = Math.min(page * PAGE_LIMIT, total);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <FolderKanban className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
            <p className="mt-0.5 text-sm text-slate-500">{total} total projects</p>
          </div>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project name…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-44 appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={sortValue}
            onChange={(e) => { setSortValue(e.target.value); setPage(1); }}
            className="w-48 appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="value_high">Value: High to Low</option>
            <option value="value_low">Value: Low to High</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {(statusFilter || sortValue !== "newest") && (
          <button
            onClick={() => { setStatusFilter(""); setSortValue("newest"); setPage(1); }}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <FolderKanban className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">
              {search ? "No projects match your search." : "No projects yet."}
            </p>
            {!search && (
              <Link
                href="/dashboard/projects/new"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add your first project
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FolderKanban className="h-3.5 w-3.5" />
                        Project
                      </span>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Client</th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Type</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Due</th>
                    <th className="hidden px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        Value
                      </span>
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((project, i) => {
                    const sd = statusDisplay(project);
                    return (
                      <tr key={project._id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-xs text-slate-400">{startItem + i}</td>
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/projects/${project._id}`} className="font-medium text-slate-900 transition hover:text-blue-600">
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          {project.client ? (
                            <div>
                              <span className="font-medium text-slate-900">{project.client.companyName}</span>
                              <span className="ml-1.5 text-xs text-slate-400">{project.client.email}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={"inline-block rounded-xl px-2.5 py-1 text-xs font-medium " + sd.color}>
                              {sd.label}
                            </span>
                            <select
                              value={project.status || "ongoing"}
                              onChange={(e) => handleStatusChange(project._id, e.target.value)}
                              disabled={statusUpdating === project._id}
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none transition focus:border-blue-500 disabled:opacity-50"
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>{statusLabels[s]}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          {project.projectType ? (
                            <span className="inline-block rounded-xl bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                              <span className="inline-flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {project.projectType}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 lg:table-cell">
                          {project.dueDate ? (
                            <span className="text-sm text-slate-600">
                              {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 lg:table-cell">
                          <span className="font-medium text-slate-900">
                            ${Number(project.projectValue).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: project._id, name: project.name })}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden p-4">
              {projects.map((project) => {
                const sd = statusDisplay(project);
                return (
                  <div key={project._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm relative">
                    <div className="absolute top-4 right-4">
                      {project.projectType ? (
                        <span className="inline-block rounded-xl bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          <span className="inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {project.projectType}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>

                    <Link href={`/dashboard/projects/${project._id}`} className="font-semibold text-slate-900 transition hover:text-blue-600">
                      {project.name}
                    </Link>

                    <div className="mt-1 text-sm text-slate-600">
                      {project.client ? (
                        <>
                          <p className="font-medium text-slate-900">{project.client.companyName}</p>
                          <p className="text-slate-400">{project.client.email}</p>
                        </>
                      ) : (
                        <p className="text-slate-400">—</p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className={"inline-block rounded-xl px-2.5 py-1 text-xs font-medium " + sd.color}>
                        {sd.label}
                      </span>
                      <select
                        value={project.status || "ongoing"}
                        onChange={(e) => handleStatusChange(project._id, e.target.value)}
                        disabled={statusUpdating === project._id}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none transition focus:border-blue-500 disabled:opacity-50"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">
                      {project.dueDate ? (
                        <span className="text-slate-500">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-slate-300">No due date</span>
                      )}
                      <span className="font-medium text-slate-900">
                        ${Number(project.projectValue).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ id: project._id, name: project.name })}
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-6 py-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span> projects
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
                        className={"inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition " + (p === page ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100")}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Project"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}