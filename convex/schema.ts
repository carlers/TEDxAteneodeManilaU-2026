import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  admins: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  registrations: defineTable({
    attendees: v.array(
      v.object({
        fullName: v.string(),
        email: v.string(),
        contactNumber: v.string(),
        schoolAffiliation: v.string(),
        participantType: v.union(
          v.literal("atenean"),
          v.literal("scholar"),
          v.literal("non_atenean"),
        ),
      }),
    ),
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
    ticketLines: v.array(
      v.object({
        purchaseMode: v.union(v.literal("individual"), v.literal("group_of_three")),
        attendeeIndices: v.array(v.number()),
        resolvedTierId: v.string(),
        unitPriceAtSubmit: v.number(),
        lineTotal: v.number(),
      }),
    ),
    paymentProofStorageId: v.id("_storage"),
    referenceCode: v.string(),
    createdAt: v.number(),
    status: v.union(v.literal("submitted"), v.literal("verified")),
    primaryAttendeeEmail: v.string(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_primaryAttendeeEmail", ["primaryAttendeeEmail"])
    .index("by_referenceCode", ["referenceCode"]),
});
