import { ChevronDown, ChevronRight } from "lucide-react";

const steps = [
  { number: 1, emoji: "👤", title: "Create Account", desc: "Sign up in seconds and set up your workspace." },
  { number: 2, emoji: "👥", title: "Add Clients", desc: "Import or add clients with all their details." },
  { number: 3, emoji: "📁", title: "Manage Projects", desc: "Track progress, deadlines, and deliverables." },
  { number: 4, emoji: "📈", title: "Grow Business", desc: "Use insights to scale and earn more." },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Get started in minutes.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              {i > 0 && (
                <>
                  <ChevronDown className="absolute -top-7 left-1/2 h-5 w-5 -translate-x-1/2 text-slate-300 lg:hidden" />
                  <ChevronRight className="absolute -left-7 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 lg:block" />
                </>
              )}

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {step.number}
              </div>

              <span className="text-3xl">{step.emoji}</span>

              <h3 className="text-lg font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="text-center text-sm text-slate-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-lg font-semibold text-blue-600">
          Simple.
        </p>
      </div>
    </section>
  );
}
