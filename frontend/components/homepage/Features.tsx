const features = [
  {
    emoji: "👥",
    title: "Client Management",
    description: "Manage clients effortlessly.",
  },
  {
    emoji: "📁",
    title: "Project Tracking",
    description: "Keep projects organized.",
  },
  {
    emoji: "💰",
    title: "Revenue Analytics",
    description: "Monitor business growth.",
  },
  {
    emoji: "📊",
    title: "Smart Dashboard",
    description: "See everything at a glance.",
  },
  {
    emoji: "🔒",
    title: "Secure Authentication",
    description: "JWT secured.",
  },
  {
    emoji: "📱",
    title: "Responsive Design",
    description: "Works everywhere.",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            Everything you need to{" "}
            <span className="text-blue-600">run your business</span>
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            A complete toolkit for freelancers and small teams.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <span className="text-3xl">{feature.emoji}</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
