import { mutationGeneric, queryGeneric } from "convex/server";
import { ConvexError, v } from "convex/values";
import { DUPLICATE_REGISTRATION_EMAIL_CODE } from "./registrationErrorCodes";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericDataModel, GenericMutationCtx, GenericQueryCtx } from "convex/server";

const participantTypeValues = new Set(["atenean", "scholar", "non_atenean"]);
const hearAboutValues = new Set([
  "facebook",
  "instagram",
  "friend_word_of_mouth",
  "organization_or_school",
  "email_blast",
  "class_or_professor",
  "posters_or_physical",
]);

const resolvedTierIds = new Set([
  "individual_atenean",
  "individual_scholar",
  "individual_non_atenean",
  "group_computed_by_types",
]);

const attendeeValidator = v.object({
  fullName: v.string(),
  email: v.string(),
  contactNumber: v.string(),
  schoolAffiliation: v.string(),
  participantType: v.union(
    v.literal("atenean"),
    v.literal("scholar"),
    v.literal("non_atenean"),
  ),
});

const ticketLineValidator = v.object({
  purchaseMode: v.union(v.literal("individual"), v.literal("group_of_three")),
  attendeeIndices: v.array(v.number()),
  resolvedTierId: v.string(),
  unitPriceAtSubmit: v.number(),
  lineTotal: v.number(),
});

function generateReferenceCode() {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");
  const randomSuffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TEDX-${timestamp}-${randomSuffix}`;
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7;
}

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

type SubmitArgs = {
  attendees: Array<{
    fullName: string;
    email: string;
    contactNumber: string;
    schoolAffiliation: string;
    participantType: "atenean" | "scholar" | "non_atenean";
  }>;
  encourageFacebookFollow: boolean;
  dataPrivacyConsent: boolean;
  emergencyContact?: string;
  hearAbout: string[];
  ticketLines: Array<{
    purchaseMode: "individual" | "group_of_three";
    attendeeIndices: number[];
    resolvedTierId: string;
    unitPriceAtSubmit: number;
    lineTotal: number;
  }>;
  paymentProofStorageId: string;
};

function validateSubmitArgs(args: SubmitArgs) {
  if (!args.dataPrivacyConsent) {
    throw new Error("Data privacy consent is required.");
  }

  if (args.attendees.length === 0) {
    throw new Error("At least one attendee is required.");
  }

  for (const attendee of args.attendees) {
    if (!participantTypeValues.has(attendee.participantType)) {
      throw new Error("Invalid participant type.");
    }
    if (!isValidPhone(attendee.contactNumber)) {
      throw new Error(
        `Invalid contact number for ${attendee.fullName || "an attendee"}. Please enter at least 7 digits.`,
      );
    }
  }

  for (const source of args.hearAbout) {
    if (!hearAboutValues.has(source)) {
      throw new Error("Invalid hear-about value.");
    }
  }

  if (args.ticketLines.length === 0) {
    throw new Error("At least one ticket line is required.");
  }

  const coveredAttendeeIndices = new Set<number>();

  for (const line of args.ticketLines) {
    if (!resolvedTierIds.has(line.resolvedTierId)) {
      throw new Error("Invalid pricing tier.");
    }
    if (line.unitPriceAtSubmit < 0 || line.lineTotal < 0) {
      throw new Error("Line pricing cannot be negative.");
    }

    const requiredLength = line.purchaseMode === "individual" ? 1 : 3;
    if (line.attendeeIndices.length !== requiredLength) {
      throw new Error("Invalid attendee count for ticket line.");
    }

    const uniqueIndices = new Set(line.attendeeIndices);
    if (uniqueIndices.size !== line.attendeeIndices.length) {
      throw new Error("Ticket line cannot include duplicate attendees.");
    }

    for (const index of line.attendeeIndices) {
      if (!Number.isInteger(index) || index < 0 || index >= args.attendees.length) {
        throw new Error("Ticket line references an invalid attendee.");
      }
      coveredAttendeeIndices.add(index);
    }
  }

  if (coveredAttendeeIndices.size !== args.attendees.length) {
    throw new Error("Each attendee must be assigned to at least one ticket line.");
  }
}

export const generateUploadUrl = mutationGeneric({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submitRegistration = mutationGeneric({
  args: {
    attendees: v.array(attendeeValidator),
    encourageFacebookFollow: v.boolean(),
    dataPrivacyConsent: v.boolean(),
    emergencyContact: v.optional(v.string()),
    hearAbout: v.array(
      v.union(
        v.literal("facebook"),
        v.literal("instagram"),
        v.literal("friend_word_of_mouth"),
        v.literal("organization_or_school"),
        v.literal("email_blast"),
        v.literal("class_or_professor"),
        v.literal("posters_or_physical"),
      ),
    ),
    ticketLines: v.array(ticketLineValidator),
    paymentProofStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    validateSubmitArgs({ ...args, paymentProofStorageId: args.paymentProofStorageId });

    const primaryEmail = (args.attendees[0]?.email ?? "").toLowerCase();
    const existing = await ctx.db
      .query("registrations")
      .withIndex("by_primaryAttendeeEmail", (q) => q.eq("primaryAttendeeEmail", primaryEmail))
      .first();
    if (existing) {
      throw new ConvexError(DUPLICATE_REGISTRATION_EMAIL_CODE);
    }

    const now = Date.now();
    const referenceCode = generateReferenceCode();
    const registrationId = await ctx.db.insert("registrations", {
      ...args,
      referenceCode,
      createdAt: now,
      status: "submitted",
      primaryAttendeeEmail: primaryEmail,
    });
    return { registrationId, referenceCode };
  },
});

export const listRegistrations = queryGeneric({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    return await ctx.db
      .query("registrations")
      .withIndex("by_createdAt")
      .order("desc")
      .take(200);
  },
});

export const getRegistration = queryGeneric({
  args: { registrationId: v.id("registrations") },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      return null;
    }

    const paymentProofUrl = await ctx.storage.getUrl(registration.paymentProofStorageId);
    return {
      ...registration,
      paymentProofUrl,
    };
  },
});

export const listAllRegistrations = queryGeneric({
  args: {},
  handler: async (ctx) => {
    await assertAdmin(ctx);
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    return await Promise.all(
      registrations.map(async (reg) => ({
        ...reg,
        paymentProofUrl: await ctx.storage.getUrl(reg.paymentProofStorageId),
      })),
    );
  },
});

export const updateRegistrationStatus = mutationGeneric({
  args: {
    registrationId: v.id("registrations"),
    status: v.union(v.literal("submitted"), v.literal("verified")),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const existing = await ctx.db.get(args.registrationId);
    if (!existing) {
      throw new Error("Registration not found.");
    }

    await ctx.db.patch(args.registrationId, {
      status: args.status,
    });

    return { ok: true };
  },
});

export const deleteRegistration = mutationGeneric({
  args: {
    registrationId: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    await assertAdmin(ctx);
    const existing = await ctx.db.get(args.registrationId);
    if (!existing) {
      throw new Error("Registration not found.");
    }

    await ctx.db.delete(args.registrationId);
    return { ok: true };
  },
});
