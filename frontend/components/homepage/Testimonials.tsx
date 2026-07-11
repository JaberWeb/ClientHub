import { Star } from "lucide-react";

const testimonials = [
  {
    stars: 5,
    quote:
      "ClientHub has completely changed how I manage my freelance business.",
    name: "John",
    role: "Designer",
  },
  {
    stars: 5,
    quote:
      "Finally a tool that understands how freelancers actually work. Invoicing and project tracking are seamless.",
    name: "Sarah",
    role: "Developer",
  },
  {
    stars: 5,
    quote:
      "I've tried dozens of CRMs. ClientHub is the only one that didn't feel overkill for a solo professional.",
    name: "Mike",
    role: "Photographer",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            What Our <span className="text-blue-600">Users Say</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Real feedback from real professionals.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <blockquote className="mt-4 text-base leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
