"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  FileText,
  Globe,
  DollarSign,
  Tag,
  Image,
  Users,
  Lock,
  Loader2,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { addProject } from "@/services/project";
import { getClients, Client } from "@/services/client";
import { useSession } from "@/app/lib/auth-client";

type AddProjectForm = {
  clientId: string;
  name: string;
  description: string;
  projectValue: number;
  projectType: string;
  dueDate: string;
  website: string;
  mediaUrl: string;
  targetAudience: string;
  credentials: string;
};

const projectTypes = [
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "Marketing",
  "Video Production",
  "Consulting",
  "Branding",
  "E-commerce",
  "SaaS",
  "Other",
];

export default function AddProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [success, setSuccess] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProjectForm>();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      try {
        const result = await getClients({ ownerId: session?.user?.id ?? "" });
        setClients(result.clients);
      } catch {
        // silently fail
      } finally {
        setClientsLoading(false);
      }
    }
    if (session?.user?.id) {
      loadClients();
    }
  }, [session]);

  const onSubmit = async (data: AddProjectForm) => {
    setError(null);
    try {
      await addProject({
        ...data,
        ownerId: session?.user?.id ?? "",
        projectValue: Number(data.projectValue),
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/projects"), 1500);
    } catch {
      setError("Failed to save project. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-10 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-emerald-900">Project added!</h2>
          <p className="mt-1 text-sm text-emerald-600">Redirecting to projects list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <FolderKanban className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Project</h1>
          <p className="mt-0.5 text-sm text-slate-500">Create a new project for a client.</p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
          {/* Basic Info */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Basic Information</h2>
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
                        {c.companyName} — {c.contactPerson}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.clientId && (
                  <p className="mt-1 text-xs text-red-600">{errors.clientId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Project name is required." })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Company Website Redesign"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Description</h2>
            </div>

            <div className="mt-5">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                {...register("description", { required: "Description is required." })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Describe the project scope, goals, and deliverables…"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Project Details</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="projectValue" className="block text-sm font-medium text-slate-700">
                  Project Value <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <DollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="projectValue"
                    type="number"
                    step="0.01"
                    {...register("projectValue", {
                      required: "Project value is required.",
                      min: { value: 0, message: "Value must be positive." },
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00"
                  />
                </div>
                {errors.projectValue && (
                  <p className="mt-1 text-xs text-red-600">{errors.projectValue.message}</p>
                )}
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

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-slate-700">
                  Website
                </label>
                <div className="relative mt-1.5">
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="website"
                    type="url"
                    {...register("website")}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="project-website.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mediaUrl" className="block text-sm font-medium text-slate-700">
                  Image / Video URL
                </label>
                <div className="relative mt-1.5">
                  <Image className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="mediaUrl"
                    type="url"
                    {...register("mediaUrl")}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="https://example.com/demo.mp4"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-700">
                  Target Audience
                </label>
                <div className="relative mt-1.5">
                  <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="targetAudience"
                    type="text"
                    {...register("targetAudience")}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Mass consumers, enterprise teams"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Project Credentials</h2>
            </div>

            <div className="mt-5">
              <label htmlFor="credentials" className="block text-sm font-medium text-slate-700">
                Login / Access Info
              </label>
              <textarea
                id="credentials"
                rows={4}
                {...register("credentials")}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Hosting login, admin URLs, usernames, passwords, API keys…"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-8 py-5">
            <Link
              href="/dashboard/projects"
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
                  Saving…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Add Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
