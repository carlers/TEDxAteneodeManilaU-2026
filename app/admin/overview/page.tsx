"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { formatPhp } from "@/lib/ticketPricing";
import type { Id } from "@/convex/_generated/dataModel";
import AdminShell from "../components/AdminShell";

type RegistrationRecord = {
  _id: Id<"registrations">;
  attendees: Array<{
    participantType: "atenean" | "scholar" | "non_atenean";
  }>;
  ticketLines: Array<{
    lineTotal: number;
  }>;
  status?: "submitted" | "verified";
};

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-tedx-muted-text">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-tedx-accent" : ""}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-tedx-muted-text">{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  const registrations = useQuery(
    api.registrations.listRegistrations,
    isAuthenticated ? {} : "skip",
  ) as RegistrationRecord[] | undefined;

  const stats = useMemo(() => {
    const records = registrations ?? [];
    const verified = records.filter((r) => r.status === "verified").length;
    const pending = records.length - verified;
    let totalRevenue = 0;
    let verifiedRevenue = 0;
    let totalAttendees = 0;
    const typeCounts = { atenean: 0, scholar: 0, non_atenean: 0 };

    for (const reg of records) {
      const regTotal = reg.ticketLines.reduce((s, l) => s + l.lineTotal, 0);
      totalRevenue += regTotal;
      if (reg.status === "verified") verifiedRevenue += regTotal;
      totalAttendees += reg.attendees.length;
      for (const attendee of reg.attendees) typeCounts[attendee.participantType]++;
    }

    return {
      total: records.length,
      verified,
      pending,
      totalRevenue,
      verifiedRevenue,
      pendingRevenue: totalRevenue - verifiedRevenue,
      totalAttendees,
      typeCounts,
    };
  }, [registrations]);

  if (isLoading) {
    return (
      <section className="min-h-[100dvh] bg-tedx-black px-4 pb-16 pt-28 text-tedx-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6">
          <p className="text-sm text-tedx-muted-text">Checking authentication…</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-[100dvh] bg-tedx-black px-4 pb-16 pt-28 text-tedx-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6">
          <p className="text-sm text-tedx-muted-text">
            You need to sign in with Google to access this page.
          </p>
          <button
            type="button"
            onClick={() => void signIn("google", { redirectTo: "/admin/overview" })}
            className="mt-4 rounded-md bg-tedx-accent px-4 py-2 text-sm font-bold uppercase hover:bg-tedx-accent-hover"
          >
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  return (
    <AdminShell title="Admin Overview" description="Summary metrics for registrations and revenue.">
      {!registrations ? (
        <p className="mt-6 text-sm text-tedx-muted-text">Loading summary…</p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Registrations" value={stats.total} />
            <StatCard label="Total Attendees" value={stats.totalAttendees} />
            <StatCard label="Pending" value={stats.pending} sub={formatPhp(stats.pendingRevenue)} />
            <StatCard
              label="Verified"
              value={stats.verified}
              sub={formatPhp(stats.verifiedRevenue)}
              accent
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Collected"
              value={formatPhp(stats.totalRevenue)}
              sub="all statuses"
            />
            <StatCard
              label="Verified Revenue"
              value={formatPhp(stats.verifiedRevenue)}
              sub="confirmed payments"
              accent
            />
            <StatCard
              label="Students"
              value={stats.typeCounts.atenean}
              sub={`${stats.typeCounts.scholar} Scholar`}
            />
            <StatCard label="Non-Atenean" value={stats.typeCounts.non_atenean} />
          </div>
        </>
      )}
    </AdminShell>
  );
}
