import { mutationGeneric } from "convex/server";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const syncAdminEmails = mutationGeneric({
  args: {},
  handler: async (ctx) => {
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
