import { Building2, Palette, Monitor, Megaphone, Rocket } from "lucide-react";

const companies = [
  { name: "Agency", icon: Building2 },
  { name: "Studio", icon: Palette },
  { name: "Digital", icon: Monitor },
  { name: "Marketing", icon: Megaphone },
  { name: "Startup", icon: Rocket },
];

export default function Featured() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            Trusted by freelancers{" "}
            <span className="text-blue-600">and growing businesses</span>
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Join thousands of professionals who already trust ClientHub to
            organize their workflow.
          </p>
        </div>

        <div className="mx-auto mt-12 flex items-center justify-center gap-4 text-slate-300">
          <span className="h-px w-12 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-widest">
            Trusted By
          </span>
          <span className="h-px w-12 bg-slate-200" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {companies.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <Icon className="h-5 w-5 text-slate-400" />
              <span className="text-base font-semibold text-slate-400">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
