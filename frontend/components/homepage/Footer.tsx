import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    label: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
    ],
  },
  {
    label: "Support",
    links: [
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy", href: "/privacy" },
    ],
  },
  {
    label: "Company",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
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

          {footerLinks.map((group) => (
            <div key={group.label}>
              <h4 className="text-sm font-semibold text-slate-900">
                {group.label}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
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
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} ClientHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
