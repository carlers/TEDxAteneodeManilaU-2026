"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import posthog from "posthog-js";

export default function AdminLoginPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();

  return (
    <section className="bg-tedx-black px-4 py-16 text-tedx-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6 sm:p-10">
        <h1 className="font-league-gothic text-5xl uppercase tracking-wide sm:text-6xl">
          Admin Login
        </h1>
        <p className="mt-3 text-sm text-tedx-muted-text">
          Sign in with your Google account. Access is granted only to allowlisted emails.
        </p>

        <div className="mt-8">
          {isLoading ? (
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-6">
              <p className="text-sm text-tedx-muted-text">Checking authentication...</p>
            </div>
          ) : isAuthenticated ? (
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-6">
              <p className="text-sm text-tedx-muted-text">You are signed in.</p>
              <Link
                href="/admin/overview"
                className="mt-4 inline-block rounded-md bg-tedx-accent px-4 py-2 text-sm font-bold uppercase hover:bg-tedx-accent-hover"
              >
                Go to admin overview
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-6">
              <p className="text-sm text-tedx-muted-text">
                Use Google sign-in to continue to the admin dashboard.
              </p>
              <button
                type="button"
                onClick={() => {
                  posthog.capture("admin_login_clicked", { provider: "google" });
                  void signIn("google", { redirectTo: "/admin/overview" });
                }}
                className="mt-4 rounded-md bg-tedx-accent px-4 py-2 text-sm font-bold uppercase hover:bg-tedx-accent-hover"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
