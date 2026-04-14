"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navItems = [
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/management", label: "Admin Management" },
];

export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <section className="min-h-[100dvh] bg-tedx-black px-4 pb-16 pt-28 text-tedx-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-tedx-muted-text">
            Admin Panel
          </p>
          <nav className="mt-3 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-tedx-accent bg-tedx-surface-deep text-tedx-white"
                      : "border-tedx-outline-strong bg-tedx-black text-tedx-muted-text hover:border-tedx-accent hover:text-tedx-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-league-gothic text-5xl uppercase tracking-wide sm:text-6xl">
                {title}
              </h1>
              <p className="mt-1 text-sm text-tedx-muted-text">{description}</p>
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
