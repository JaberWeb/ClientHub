import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    desc: "Perfect for getting started.",
    features: ["Up to 5 clients", "3 active projects", "Basic dashboard"],
  },
  {
    name: "Pro",
    desc: "For growing freelancers.",
    features: ["Unlimited clients", "Unlimited projects", "Revenue analytics", "Priority support"],
    popular: true,
  },
  {
    name: "Business",
    desc: "For small teams.",
    features: ["Everything in Pro", "Team collaboration", "Custom reports", "API access"],
  },
];

export default function Pricing() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            Simple, <span className="text-blue-600">Transparent</span> Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Affordable plans for freelancers and small businesses.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {plan.name}
                </h3>
                <span className="rounded-lg border border-slate-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  Coming Soon
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">
                  $0
                </span>
                <span className="text-sm text-slate-400">/mo</span>
              </div>

              <hr className="my-6 border-slate-200" />

              <div className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <button
                disabled
                className="mt-8 w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-400"
              >
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
