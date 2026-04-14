import { getAuthUserId } from "@convex-dev/auth/server";
import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";
import type { GenericDataModel, GenericMutationCtx, GenericQueryCtx } from "convex/server";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

function isEmailAllowlisted(email: string) {
  const raw = process.env.ADMIN_EMAILS ?? "";
  const allowlist = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

async function assertAdmin(
  ctx: GenericQueryCtx<GenericDataModel> | GenericMutationCtx<GenericDataModel>,
) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated.");
  }

  const user = await ctx.db.get(userId);
  const emailValue = user?.email;
  if (typeof emailValue !== "string") {
    throw new Error("Authenticated user is missing an email.");
  }
  const userEmail = emailValue.toLowerCase();

  const dbAdmin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", userEmail))
    .first();

  if (!dbAdmin && !isEmailAllowlisted(userEmail)) {
    throw new Error("Not authorized.");
  }
}

export const syncAdminEmails = mutationGeneric({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    const envEmails = process.env.ADMIN_EMAILS ?? "";
    const nextEmails = Array.from(
      new Set(
        envEmails
          .split(",")
          .map(normalizeEmail)
          .filter((email) => email.length > 0),
      ),
    );

    const existing = await ctx.db.query("admins").collect();
    const existingByEmail = new Map(existing.map((entry) => [entry.email, entry._id]));
    const nextEmailSet = new Set(nextEmails);

    for (const email of nextEmails) {
      if (!existingByEmail.has(email)) {
        await ctx.db.insert("admins", { email });
      }
    }

    for (const entry of existing) {
      if (!nextEmailSet.has(entry.email)) {
        await ctx.db.delete(entry._id);
      }
    }

    return { ok: true, count: nextEmails.length };
  },
});

export const listAdmins = queryGeneric({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return await ctx.db.query("admins").withIndex("by_email").collect();
  },
});

export const addAdmin = mutationGeneric({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const email = normalizeEmail(args.email);
    if (!email || !email.includes("@")) {
      throw new Error("Please provide a valid email.");
    }

    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { ok: true, id: existing._id, alreadyExists: true };
    }

    const id = await ctx.db.insert("admins", { email });
    return { ok: true, id, alreadyExists: false };
  },
});

export const removeAdmin = mutationGeneric({
  args: { adminId: v.id("admins") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const user = await ctx.db.get(userId);
    const currentUserEmail =
      typeof user?.email === "string" ? user.email.toLowerCase() : null;
    if (!currentUserEmail) {
      throw new Error("Authenticated user is missing an email.");
    }

    const adminToRemove = await ctx.db.get(args.adminId);
    if (!adminToRemove) {
      throw new Error("Admin not found.");
    }

    if (adminToRemove.email === currentUserEmail) {
      throw new Error("You cannot remove your own admin access.");
    }

    const currentAdmins = await ctx.db.query("admins").collect();
    if (currentAdmins.length <= 1) {
      throw new Error("Cannot remove the last remaining admin.");
    }

    await ctx.db.delete(args.adminId);
    return { ok: true };
  },
});
