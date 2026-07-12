import Link from "next/link";
import { ArrowRight, Check, Target, Eye, Heart, BriefcaseBusiness } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Empower freelancers and small businesses to manage clients, projects, and revenue effortlessly — so they can focus on what they do best.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A world where every independent professional has enterprise-grade business management tools at their fingertips, without the complexity or cost.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Simplicity, transparency, and reliability drive every decision we make. We build tools we'd use ourselves.",
  },
];

const offerings = [
  { emoji: "👥", title: "Client Management", description: "Store contacts, track communication, and never miss a detail." },
  { emoji: "📁", title: "Project Tracking", description: "Organize projects, set deadlines, and monitor progress in real time." },
  { emoji: "💰", title: "Revenue Analytics", description: "Track paid invoices, monitor upcoming revenue, and understand your finances." },
  { emoji: "📊", title: "Smart Dashboard", description: "See your entire business at a glance with real-time stats and recent activity." },
  { emoji: "📄", title: "Invoice Management", description: "Create, send, and manage invoices with auto-generated numbers and print-ready PDFs." },
  { emoji: "🔒", title: "Secure by Default", description: "JWT authentication, encrypted data, and secure API — your data stays yours." },
];

const stats = [
  { value: "500", suffix: "+", label: "Projects Managed" },
  { value: "200", suffix: "+", label: "Happy Businesses" },
  { value: "$2M", suffix: "+", label: "Revenue Tracked" },
  { value: "99.9", suffix: "%", label: "Uptime" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <BriefcaseBusiness className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            About ClientHub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 lg:text-xl">
            We help freelancers and small businesses take control of their client work, projects, and revenue — without the chaos.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Our Story
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-500">
              ClientHub was born from a simple frustration — juggling spreadsheets, sticky notes, and half a dozen tools just to keep track of clients and projects. We realized that freelancers and small teams deserve the same powerful business management tools that enterprises have, without the enterprise price tag or complexity.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-500">
              So we built ClientHub: a clean, intuitive platform that brings client management, project tracking, invoicing, and revenue analytics together in one place. No bloat, no confusion — just the tools you actually need.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              What Drives Us
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              The principles that guide everything we build.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <v.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              What We Offer
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Everything you need to run your business smoothly.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((o) => (
              <div
                key={o.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <span className="text-3xl">{o.emoji}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{o.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{o.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                {i > 0 && <div className="h-px w-12 bg-slate-200 lg:hidden" />}
                <span className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                  {s.value}{s.suffix}
                </span>
                <span className="text-sm font-medium text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-16 text-center shadow-lg lg:px-16">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                Ready to simplify your workflow?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100">
                Join hundreds of businesses already using ClientHub to manage clients, projects, and revenue.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 hover:shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex h-12 items-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
                >
                  Explore Features
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  No credit card
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Free to start
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
