"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Briefcase,
  MapPin,
  FileText,
  Loader2,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { addClient } from "@/services/client";
import { useSession } from "@/app/lib/auth-client";

type AddClientForm = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  notes: string;
};

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Legal",
  "Marketing",
  "E-commerce",
  "Consulting",
  "Other",
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Bangladesh",
  "Other",
];

export default function AddClientPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddClientForm>();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: AddClientForm) => {
    setError(null);
    try {
      await addClient({ ...data, ownerId: session?.user?.id ?? "" });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/clients"), 1500);
    } catch {
      setError("Failed to save client. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-10 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-emerald-900">Client added!</h2>
          <p className="mt-1 text-sm text-emerald-600">Redirecting to clients list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard/clients"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add Client
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Add a new client to your workspace.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form card */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
          {/* Company Info */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Company Information
              </h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  {...register("companyName", { required: "Company name is required." })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Acme Corp"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="contactPerson"
                    type="text"
                    {...register("contactPerson", { required: "Contact name is required." })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="John Doe"
                  />
                </div>
                {errors.contactPerson && (
                  <p className="mt-1 text-xs text-red-600">{errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required.",
                      pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email." },
                    })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="john@acme.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <div className="relative mt-1.5">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
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
                    placeholder="acme.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-slate-700">
                  Industry
                </label>
                <div className="relative mt-1.5">
                  <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="industry"
                    {...register("industry")}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="px-8 py-7">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Address</h2>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-slate-700">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  {...register("street")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="123 Main St, Suite 100"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="San Francisco"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-700">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  {...register("state")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="CA"
                />
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-slate-700">
                  ZIP / Postal Code
                </label>
                <input
                  id="zip"
                  type="text"
                  {...register("zip")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="94105"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                  Country
                </label>
                <select
                  id="country"
                  {...register("country")}
                  className="mt-1.5 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
                rows={4}
                {...register("notes")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="Any additional notes about this client…"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-8 py-5">
            <Link
              href="/dashboard/clients"
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
                  Add Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
