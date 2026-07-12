"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Loader2, Check, ArrowRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { sendContactMessage } from "@/services/contact";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setSending(true);
    setError(null);

    try {
      await sendContactMessage({ name, email, subject, message });
      setSent(true);
    } catch {
      setError("Failed to send message. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="bg-slate-50">
        <div className="mx-auto flex max-w-2xl items-center justify-center px-6 py-24 lg:px-8 lg:py-32">
          <div className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-10 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-emerald-900">Message Sent!</h2>
            <p className="mt-2 text-sm text-emerald-600">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-blue-100">
            Have a question, feedback, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-8 py-5">
                  <h2 className="text-lg font-semibold text-slate-900">Send us a message</h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    We&apos;ll respond within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
                  <div className="space-y-5 px-8 py-7">
                    {error && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Tell us more about your inquiry…"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end px-8 py-5">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Email */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Email Us</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Prefer writing an email? Reach out directly.
                </p>
                <a
                  href="mailto:molla.jaber@gmail.com"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  molla.jaber@gmail.com
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* WhatsApp */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">WhatsApp</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Chat with us instantly on WhatsApp.
                </p>
                <a
                  href="https://wa.me/8801781700919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Start Chat
                </a>
              </div>

              {/* Brand */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600">
                    <BriefcaseBusiness className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">ClientHub</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  We&apos;re here to help you succeed. Reach out anytime — we typically respond within a few hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
