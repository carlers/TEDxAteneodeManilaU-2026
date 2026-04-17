/**
 * Application error payloads for `registrations:submitRegistration`.
 * Thrown with {@link ConvexError} from `convex/values` so the client can branch safely.
 */
export const DUPLICATE_REGISTRATION_EMAIL_CODE = "duplicate_registration_email" as const;
