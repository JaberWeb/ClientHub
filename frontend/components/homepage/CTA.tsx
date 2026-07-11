"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

export default function CTA() {
  const { data: session } = useSession();
  return (
    <section className="bg-blue-600">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
        <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
          Ready to organize your business?
        </h2>

        <p className="mt-4 text-lg text-blue-100">
          Start using ClientHub today.
        </p>

        <Link
          href={session ? "/dashboard" : "/auth/signup"}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
        >
          {session ? "Dashboard" : "Get Started"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
