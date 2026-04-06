"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { formatPhp } from "@/lib/ticketPricing";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type RegistrationRecord = {
  _id: Id<"registrations">;
  _creationTime: number;
  referenceCode?: string;
  attendees: Array<{
    fullName: string;
    email: string;
    contactNumber: string;
    schoolAffiliation: string;
    participantType: "student" | "aman_scholar" | "external";
  }>;
  hearAbout: string[];
  emergencyContact?: string;
  encourageFacebookFollow: boolean;
  dataPrivacyConsent: boolean;
  ticketLines: Array<{
    purchaseMode: "individual" | "group_of_three";
    attendeeIndices: number[];
    resolvedTierId: string;
    unitPriceAtSubmit: number;
    lineTotal: number;
  }>;
  paymentProofStorageId: string;
  paymentProofUrl?: string | null;
  createdAt: number;
  status?: "submitted" | "verified";
};

const participantTypeLabels: Record<RegistrationRecord["attendees"][number]["participantType"], string> =
  {
    student: "Student",
    aman_scholar: "AMAn / Scholar",
    external: "External",
  };

export default function AdminRegistrationsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const registrations = useQuery(
    api.registrations.listRegistrations,
    isAuthenticated ? {} : "skip",
  ) as RegistrationRecord[] | undefined;
  const [selectedId, setSelectedId] = useState<Id<"registrations"> | "">("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "verified">("all");
  const [search, setSearch] = useState("");
  const updateRegistrationStatus = useMutation(api.registrations.updateRegistrationStatus);

  const selectedRegistration = useQuery(
    api.registrations.getRegistration,
    isAuthenticated && selectedId ? { registrationId: selectedId } : "skip",
  ) as RegistrationRecord | null | undefined;

  useEffect(() => {
    if (!registrations || registrations.length === 0) return;
    if (!selectedId) {
      setSelectedId(registrations[0]._id);
    }
  }, [registrations, selectedId]);

  const selectedTotal = useMemo(() => {
    if (!selectedRegistration) return 0;
    return selectedRegistration.ticketLines.reduce((sum, line) => sum + line.lineTotal, 0);
  }, [selectedRegistration]);

  const stats = useMemo(() => {
    const records = registrations ?? [];
    const total = records.length;
    const verified = records.filter((item) => item.status === "verified").length;
    const pending = total - verified;
    const revenue = records.reduce((sum, registration) => {
      return (
        sum +
        registration.ticketLines.reduce((lineSum, line) => lineSum + line.lineTotal, 0)
      );
    }, 0);
    return { total, verified, pending, revenue };
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    const records = registrations ?? [];
    return records.filter((registration) => {
      const currentStatus = registration.status ?? "submitted";
      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }
      if (!query) return true;
      const text = [
        registration.referenceCode ?? "",
        registration.attendees[0]?.fullName ?? "",
        registration.attendees[0]?.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [registrations, statusFilter, search]);

  const updateStatus = async (nextStatus: "submitted" | "verified") => {
    if (!selectedRegistration) return;
    try {
      setIsUpdatingStatus(true);
      await updateRegistrationStatus({
        registrationId: selectedRegistration._id,
        status: nextStatus,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-tedx-black px-4 py-12 text-tedx-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6">
          <p className="text-sm text-tedx-muted-text">Checking authentication...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="bg-tedx-black px-4 py-12 text-tedx-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6">
          <p className="text-sm text-tedx-muted-text">
            You need to sign in with Google to access this page.
          </p>
          <button
            type="button"
            onClick={() => void signIn("google", { redirectTo: "/admin/registrations" })}
            className="mt-4 rounded-md bg-tedx-accent px-4 py-2 text-sm font-bold uppercase hover:bg-tedx-accent-hover"
          >
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-tedx-black px-4 py-12 text-tedx-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6 sm:p-8">
        <h1 className="font-league-gothic text-5xl uppercase tracking-wide sm:text-6xl">
          Admin Registrations
        </h1>
        <p className="mt-2 text-sm text-tedx-muted-text">
          Admin view is protected by Convex authentication and admin checks.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
            <p className="text-xs uppercase text-tedx-muted-text">Total Registrations</p>
            <p className="mt-1 text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
            <p className="text-xs uppercase text-tedx-muted-text">Pending</p>
            <p className="mt-1 text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
            <p className="text-xs uppercase text-tedx-muted-text">Verified</p>
            <p className="mt-1 text-2xl font-bold">{stats.verified}</p>
          </div>
          <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
            <p className="text-xs uppercase text-tedx-muted-text">Total Collected</p>
            <p className="mt-1 text-2xl font-bold">{formatPhp(stats.revenue)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference, name, or email…"
            className="rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | "submitted" | "verified")
            }
            className="rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Pending</option>
            <option value="verified">Verified</option>
          </select>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-lg border border-tedx-accent bg-tedx-surface-deep px-4 py-3 text-sm text-tedx-accent">
            {errorMessage}
          </div>
        )}

        {!registrations ? (
          <p className="mt-8 text-sm text-tedx-muted-text">Loading registrations...</p>
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-3">
              <div className="mb-2 grid grid-cols-[1.2fr_1fr_auto] gap-2 px-2 text-[10px] font-bold uppercase text-tedx-muted-text">
                <span>Registrant</span>
                <span>Reference</span>
                <span>Status</span>
              </div>
              <div className="max-h-[580px] space-y-2 overflow-y-auto pr-1">
              {filteredRegistrations.map((registration) => {
                const total = registration.ticketLines.reduce(
                  (sum, line) => sum + line.lineTotal,
                  0,
                );
                const currentStatus = registration.status ?? "submitted";
                return (
                  <button
                    key={registration._id}
                    type="button"
                    onClick={() => setSelectedId(registration._id)}
                    className={`block w-full rounded-lg border p-3 text-left transition ${
                      selectedId === registration._id
                        ? "border-tedx-accent bg-tedx-surface-deep"
                        : "border-tedx-outline-strong bg-tedx-black hover:border-tedx-accent"
                    }`}
                  >
                    <div className="grid grid-cols-[1.2fr_1fr_auto] items-start gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {registration.attendees[0]?.fullName ?? "Unknown attendee"}
                        </p>
                        <p className="truncate text-xs text-tedx-muted-text">
                          {registration.attendees[0]?.email ?? "No email"}
                        </p>
                        <p className="mt-1 text-[11px] text-tedx-muted-text">
                          {formatPhp(total)}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold uppercase text-tedx-accent">
                          {registration.referenceCode ?? `LEGACY-${registration._id.slice(0, 8)}`}
                        </p>
                        <p className="mt-1 text-[11px] text-tedx-muted-text">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                          currentStatus === "verified"
                            ? "bg-tedx-accent text-tedx-white"
                            : "bg-tedx-surface-deep text-tedx-muted-text"
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </div>
                  </button>
                );
              })}
              </div>
              {filteredRegistrations.length === 0 && (
                <p className="px-2 py-4 text-sm text-tedx-muted-text">No matching records.</p>
              )}
            </div>

            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              {!selectedRegistration ? (
                <p className="text-sm text-tedx-muted-text">Select a registration to view details.</p>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border border-tedx-outline-strong bg-tedx-black p-3">
                    <p className="text-xs uppercase text-tedx-muted-text">Reference Number</p>
                    <p className="mt-1 text-base font-bold text-tedx-accent">
                      {selectedRegistration.referenceCode ??
                        `LEGACY-${selectedRegistration._id.slice(0, 8)}`}
                    </p>
                    <p className="mt-2 text-xs uppercase text-tedx-muted-text">
                      Status: {selectedRegistration.status ?? "submitted"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          isUpdatingStatus || selectedRegistration.status === "verified"
                        }
                        onClick={() => void updateStatus("verified")}
                        className="rounded-md bg-tedx-accent px-3 py-2 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:bg-tedx-disabled"
                      >
                        Confirm Payment
                      </button>
                      <button
                        type="button"
                        disabled={
                          isUpdatingStatus || selectedRegistration.status === "submitted"
                        }
                        onClick={() => void updateStatus("submitted")}
                        className="rounded-md border border-tedx-outline-strong px-3 py-2 text-xs font-bold uppercase disabled:cursor-not-allowed disabled:text-tedx-disabled-text"
                      >
                        Mark as Pending
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase">Attendees</h2>
                    <div className="mt-3 overflow-x-auto rounded-lg border border-tedx-outline-strong bg-tedx-black">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-tedx-outline-strong text-xs uppercase text-tedx-muted-text">
                          <tr>
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Full Name</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Contact</th>
                            <th className="px-3 py-2">School / Affiliation</th>
                            <th className="px-3 py-2">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRegistration.attendees.map((attendee, index) => (
                            <tr
                              key={`attendee-detail-${index}`}
                              className="border-b border-tedx-outline-strong/60 last:border-b-0"
                            >
                              <td className="px-3 py-2 text-tedx-muted-text">{index + 1}</td>
                              <td className="px-3 py-2 font-semibold">{attendee.fullName}</td>
                              <td className="px-3 py-2 text-tedx-muted-text">{attendee.email}</td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {attendee.contactNumber}
                              </td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {attendee.schoolAffiliation}
                              </td>
                              <td className="px-3 py-2 text-tedx-accent">
                                {participantTypeLabels[attendee.participantType]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase">Tickets</h2>
                    <div className="mt-3 overflow-x-auto rounded-lg border border-tedx-outline-strong bg-tedx-black">
                      <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-tedx-outline-strong text-xs uppercase text-tedx-muted-text">
                          <tr>
                            <th className="px-3 py-2">Line</th>
                            <th className="px-3 py-2">Tier</th>
                            <th className="px-3 py-2">Mode</th>
                            <th className="px-3 py-2">Attendees</th>
                            <th className="px-3 py-2">Unit Price</th>
                            <th className="px-3 py-2">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRegistration.ticketLines.map((line, index) => (
                            <tr
                              key={`line-detail-${index}`}
                              className="border-b border-tedx-outline-strong/60 last:border-b-0"
                            >
                              <td className="px-3 py-2 text-tedx-muted-text">{index + 1}</td>
                              <td className="px-3 py-2 font-semibold">{line.resolvedTierId}</td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {line.purchaseMode === "group_of_three"
                                  ? "Group of 3"
                                  : "Individual"}
                              </td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {line.attendeeIndices.map((value) => value + 1).join(", ")}
                              </td>
                              <td className="px-3 py-2 text-tedx-muted-text">
                                {formatPhp(line.unitPriceAtSubmit)}
                              </td>
                              <td className="px-3 py-2 font-semibold text-tedx-accent">
                                {formatPhp(line.lineTotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-sm font-bold uppercase text-tedx-accent">
                      Total: {formatPhp(selectedTotal)}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase">Payment Proof</h2>
                    {selectedRegistration.paymentProofUrl ? (
                      <a
                        href={selectedRegistration.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-tedx-accent hover:text-tedx-accent-hover"
                      >
                        Open uploaded proof
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-tedx-muted-text">No payment proof URL found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
