import { BriefcaseBusiness, TrendingUp, DollarSign, Users, FolderKanban, Clock, Check } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Dashboard Mockup */}
          <div className="relative">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
                    <BriefcaseBusiness className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    Dashboard
                  </span>
                </div>
                <span className="text-xs text-slate-400">Last 30 days</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 p-6">
                {/* Revenue */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Revenue
                    </span>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    $12,480
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">
                      ↑12%
                    </span>
                  </div>
                  {/* Mini bar sparkline */}
                  <div className="mt-3 flex items-end gap-[3px]">
                    {[40, 52, 45, 58, 48, 62, 55, 65, 58, 68, 72, 78, 82, 88].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-2 rounded-sm"
                          style={{
                            height: `${h * 0.5}px`,
                            backgroundColor:
                              i >= 10 ? "#2563EB" : "#2563EB33",
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Clients */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Clients
                    </span>
                    <Users className="h-4 w-4 text-teal-500" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">
                      ↑8%
                    </span>
                  </div>
                </div>

                {/* Projects */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Projects
                    </span>
                    <FolderKanban className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">18</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs font-medium text-emerald-500">
                      ↑3
                    </span>
                    <span className="text-xs text-slate-400">active</span>
                  </div>
                </div>

                {/* Deadlines */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Deadlines
                    </span>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900">7</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs font-medium text-amber-500">
                      ↑2
                    </span>
                    <span className="text-xs text-slate-400">this week</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border-t border-slate-200 px-6 py-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recent Activity
                </h4>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100">
                      <span className="text-xs font-bold text-teal-700">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        ABC Ltd
                      </p>
                      <p className="text-xs text-slate-400">Invoice paid</p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Paid
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative offset card */}
            <div className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-xl border border-slate-200 bg-slate-100/50" />
          </div>

          {/* Right — Content */}
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              <span className="text-blue-600">Everything</span> you need.
            </h2>

            <p className="max-w-lg text-lg leading-relaxed text-slate-500">
              From client onboarding to final reporting — ClientHub gives you
              full visibility into your business health at a glance.
            </p>

            <div className="flex flex-col gap-4">
              {["Revenue", "Clients", "Projects", "Reports", "Analytics"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-base text-slate-700">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
