"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Settings,
  Building2,
  MapPin,
  Image,
  Upload,
  Loader2,
  Check,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getSettings, saveSettings, CompanySettings } from "@/services/settings";
import { useSession } from "@/app/lib/auth-client";

type SettingsForm = {
  companyName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  logoUrl: string;
  country: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [success, setSuccess] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SettingsForm>();

  const [error, setError] = useState<string | null>(null);
  const logoUrl = watch("logoUrl");

  useEffect(() => {
    async function load() {
      if (!session?.user?.id) return;
      try {
        const data = await getSettings(session.user.id);
        if (data) {
          setValue("companyName", data.companyName || "");
          setValue("street", data.street || "");
          setValue("city", data.city || "");
          setValue("state", data.state || "");
          setValue("zip", data.zip || "");
          setValue("logoUrl", data.logoUrl || "");
          setLogoPreview(data.logoUrl || "");
          setValue("country", data.country || "");
        }
      } catch {
        // settings not found — fresh form
      }
    }
    load();
  }, [session, setValue]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const formData = new FormData();
        formData.append("image", base64);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: formData }
        );
        const json = await res.json();

        if (json.success) {
          const url = json.data.url;
          setValue("logoUrl", url);
          setLogoPreview(url);
        } else {
          setError("Failed to upload logo. Please try again.");
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Failed to upload logo. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const onSubmit = async (data: SettingsForm) => {
    if (!session?.user?.id) return;
    setError(null);
    try {
      await saveSettings({ ...data, ownerId: session.user.id });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save settings. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-20">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-10 py-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-emerald-900">Settings saved!</h2>
          <p className="mt-1 text-sm text-emerald-600">Your company info has been updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <Settings className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage your company info used on invoices.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {saved && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Settings saved successfully!
        </div>
      )}

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
                  Company / Legal Name <span className="text-red-500">*</span>
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

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Company Logo
                </label>
                <div className="mt-1.5 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-14 w-14 rounded-lg object-contain"
                      />
                    ) : (
                      <Image className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <Upload className="h-4 w-4" />
                      {logoUploading ? "Uploading…" : "Upload Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={logoUploading}
                        className="sr-only"
                      />
                    </label>
                    {logoUploading && (
                      <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-slate-400" />
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG or WebP. Uploaded via imgbb.
                    </p>
                  </div>
                </div>
                {logoUrl && (
                  <div className="mt-3">
                    <label htmlFor="logoUrl" className="block text-xs font-medium text-slate-500">
                      Or paste an image URL
                    </label>
                    <input
                      id="logoUrl"
                      type="url"
                      {...register("logoUrl")}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                )}
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
                <label className="block text-sm font-medium text-slate-700">
                  Country
                </label>
                <input
                  id="country"
                  type="text" 
                  {...register("country")}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
         
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 px-8 py-5">
            <button
              type="submit"
              disabled={isSubmitting || logoUploading}
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
