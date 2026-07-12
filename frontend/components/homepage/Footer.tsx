import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <BriefcaseBusiness className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                ClientHub
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Manage clients, projects, and revenue without the chaos.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Links</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Contact</h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a href="mailto:molla.jaber@gmail.com" className="text-sm text-slate-500 transition hover:text-blue-600">
                  molla.jaber@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/8801781700919" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 transition hover:text-blue-600">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} ClientHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
