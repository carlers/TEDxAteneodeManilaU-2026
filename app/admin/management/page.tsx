"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import AdminShell from "../components/AdminShell";

export default function AdminManagementPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  const admins = useQuery(api.admins.listAdmins, isAuthenticated ? {} : "skip");
  const addAdmin = useMutation(api.admins.addAdmin);
  const removeAdmin = useMutation(api.admins.removeAdmin);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAdminId, setPendingAdminId] = useState<Id<"admins"> | null>(null);

  const handleAddAdmin = async () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email) return;
    try {
      setIsSaving(true);
      setFeedback(null);
      const result = await addAdmin({ email });
      setFeedback({
        type: "success",
        message: result.alreadyExists ? "Admin already exists." : "Admin added successfully.",
      });
      setNewAdminEmail("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add admin.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAdmin = async (adminId: Id<"admins">) => {
    if ((admins?.length ?? 0) <= 1) {
      setFeedback({ type: "error", message: "Cannot remove the last remaining admin." });
      return;
    }
    try {
      setPendingAdminId(adminId);
      setIsSaving(true);
      setFeedback(null);
      await removeAdmin({ adminId });
      setFeedback({ type: "success", message: "Admin removed successfully." });
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : "Failed to remove admin.";
      const message = rawMessage.includes("cannot remove your own admin access")
        ? "You cannot remove your own admin access."
        : rawMessage;
      setFeedback({ type: "error", message });
    } finally {
      setPendingAdminId(null);
      setIsSaving(false);
    }
  };

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
            onClick={() => void signIn("google", { redirectTo: "/admin/management" })}
            className="mt-4 rounded-md bg-tedx-accent px-4 py-2 text-sm font-bold uppercase hover:bg-tedx-accent-hover"
          >
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  return (
    <AdminShell
      title="Admin Management"
      description="Add or remove admin access for this panel."
    >
      <div className="mt-6 flex w-full max-w-xl gap-2">
        <input
          type="email"
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
          placeholder="new-admin@email.com"
          className="min-w-0 flex-1 rounded-md border border-tedx-outline-strong bg-tedx-surface-deep px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
        />
        <button
          type="button"
          disabled={isSaving || !newAdminEmail.trim()}
          onClick={() => void handleAddAdmin()}
          className="rounded-md bg-tedx-accent px-3 py-2 text-xs font-bold uppercase hover:bg-tedx-accent-hover disabled:cursor-not-allowed disabled:bg-tedx-disabled"
        >
          {isSaving && !pendingAdminId ? "Adding…" : "Add Admin"}
        </button>
      </div>

      {feedback && (
        <div
          className={`mt-3 rounded-md border px-3 py-2 text-xs ${
            feedback.type === "success"
              ? "border-green-700 bg-green-950/60 text-green-400"
              : "border-tedx-accent bg-tedx-surface-deep text-tedx-accent"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {(admins ?? []).map((admin) => {
          const disableRemove = isSaving || (admins?.length ?? 0) <= 1;
          return (
            <div
              key={admin._id}
              className="inline-flex items-center gap-2 rounded-full border border-tedx-outline-strong bg-tedx-surface-deep px-3 py-1.5 text-xs"
            >
              <span>{admin.email}</span>
              <button
                type="button"
                onClick={() => void handleRemoveAdmin(admin._id)}
                disabled={disableRemove}
                className="text-tedx-accent hover:text-tedx-accent-hover disabled:cursor-not-allowed disabled:text-tedx-disabled-text"
                aria-label={`Remove admin ${admin.email}`}
                title={(admins?.length ?? 0) <= 1 ? "At least one admin is required." : undefined}
              >
                {pendingAdminId === admin._id ? "Removing…" : "Remove"}
              </button>
            </div>
          );
        })}
        {admins && admins.length === 0 && (
          <p className="text-xs text-tedx-muted-text">No admins in table yet.</p>
        )}
      </div>
    </AdminShell>
  );
}
