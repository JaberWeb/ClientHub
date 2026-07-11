import {
  BriefcaseBusiness,
  TrendingUp,
  DollarSign,
  Users,
  FolderKanban,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Revenue</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">$12,480</p>
          <div className="mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">↑12%</span>
          </div>
          <div className="mt-4 flex items-end gap-[3px]">
            {[40, 52, 45, 58, 48, 62, 55, 65, 58, 68, 72, 78, 82, 88].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-sm"
                  style={{
                    height: `${h * 0.4}px`,
                    backgroundColor: i >= 10 ? "#2563EB" : "#2563EB33",
                  }}
                />
              ),
            )}
          </div>
        </div>

        {/* Clients */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Clients</span>
            <Users className="h-4 w-4 text-teal-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">142</p>
          <div className="mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">↑8%</span>
          </div>
        </div>

        {/* Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Projects</span>
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">18</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-medium text-emerald-500">↑3</span>
            <span className="text-xs text-slate-400">active</span>
          </div>
        </div>

        {/* Deadlines */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Deadlines</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">7</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs font-medium text-amber-500">↑2</span>
            <span className="text-xs text-slate-400">this week</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Recent Activity
            </span>
          </div>
          <span className="text-xs text-slate-400">Last 30 days</span>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { name: "ABC Ltd", detail: "Invoice paid", badge: "Paid", badgeColor: "bg-emerald-100 text-emerald-700" },
            { name: "Sarah Design", detail: "Project completed", badge: "Done", badgeColor: "bg-emerald-100 text-emerald-700" },
            { name: "TechCorp", detail: "New invoice sent", badge: "Sent", badgeColor: "bg-blue-100 text-blue-700" },
            { name: "StartupX", detail: "Payment overdue", badge: "Overdue", badgeColor: "bg-red-100 text-red-700" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100">
                  <span className="text-xs font-bold text-teal-700">
                    {activity.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {activity.name}
                  </p>
                  <p className="text-xs text-slate-400">{activity.detail}</p>
                </div>
              </div>
              <span
                className={`rounded-xl px-2 py-0.5 text-xs font-medium ${activity.badgeColor}`}
              >
                {activity.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
