"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  formatPhp,
  getPricingConfig,
  ParticipantType,
  resolveGroupLine,
  resolveIndividualLine,
} from "@/lib/ticketPricing";

type PurchaseMode = "individual" | "group_of_three";

type Attendee = {
  fullName: string;
  email: string;
  contactNumber: string;
  schoolAffiliation: string;
  participantType: ParticipantType;
};

type ComputedLine = {
  purchaseMode: PurchaseMode;
  attendeeIndices: number[];
  tierId: string;
  label: string;
  unitPrice: number;
  lineTotal: number;
  baseTotal?: number;
  discountAmount?: number;
  participantBreakdown?: Array<{
    participantType: ParticipantType;
    unitPrice: number;
  }>;
};

type SuccessReceipt = {
  referenceCode: string;
  totalAmount: number;
  primaryName: string;
  primaryEmail: string;
  attendeeNames: string[];
};
type FieldErrors = Record<string, string>;

const hearAboutOptions = [
  { id: "facebook", label: "Facebook (TEDxAteneoDeManilaU page)" },
  { id: "instagram", label: "Instagram" },
  { id: "friend_word_of_mouth", label: "Friend / Word of Mouth" },
  { id: "organization_or_school", label: "Organization or School Announcement" },
  { id: "email_blast", label: "Email Blast" },
  { id: "class_or_professor", label: "Class / Professor Announcement" },
  { id: "posters_or_physical", label: "Posters or Physical Promotions" },
] as const;
type HearAboutOption = (typeof hearAboutOptions)[number]["id"];

const participantTypeOptions = [
  { id: "atenean", label: "AMAn / Atenean / TEDx" },
  { id: "scholar", label: "Scholar" },
  { id: "non_atenean", label: "Non-Atenean" },
] as const;

const initialAttendee: Attendee = {
  fullName: "",
  email: "",
  contactNumber: "",
  schoolAffiliation: "",
  participantType: "atenean",
};

const steps = [
  "Profile",
  "Ticket",
  "Attendees",
  "Payment",
] as const;
const draftStorageKey = "tedxRegistrationDraftV2";

function isAttendeeComplete(attendee: Attendee) {
  return (
    attendee.fullName.trim() &&
    attendee.email.trim() &&
    attendee.contactNumber.trim() &&
    attendee.schoolAffiliation.trim()
  );
}

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

function formatRelativeTime(ts: number, now: number): string {
  const seconds = Math.round((now - ts) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7;
}

function StyledCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent focus-visible:ring-offset-1 focus-visible:ring-offset-tedx-surface-deep ${
        checked ? "border-tedx-accent bg-tedx-accent" : "border-tedx-outline-strong bg-tedx-black"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
          <path
            d="M1.5 5l2.5 2.5 4.5-4.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export default function RegisterPage() {
  const pricing = getPricingConfig();
  const generateUploadUrl = useMutation(api.registrations.generateUploadUrl);
  const submitRegistration = useMutation(api.registrations.submitRegistration);

  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>("individual");
  const [attendees, setAttendees] = useState<Attendee[]>([{ ...initialAttendee }]);
  const [hearAbout, setHearAbout] = useState<HearAboutOption[]>([]);
  const [encourageFacebookFollow, setEncourageFacebookFollow] = useState(true);
  const [dataPrivacyConsent, setDataPrivacyConsent] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUploadError, setProofUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<"uploading" | "submitting">("uploading");
  const [copied, setCopied] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [stepError, setStepError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(interval);
  }, []);

  const computedLines = useMemo<ComputedLine[]>(() => {
    if (purchaseMode === "individual") {
      const attendee = attendees[0] ?? initialAttendee;
      const tier = resolveIndividualLine(attendee.participantType);
      return [
        {
          purchaseMode,
          attendeeIndices: [0],
          tierId: tier.tierId,
          label: tier.label,
          unitPrice: tier.unitPrice,
          lineTotal: tier.unitPrice,
        },
      ];
    }

    const group = attendees.slice(0, 3);
    if (group.length < 3) {
      return [
        {
          purchaseMode,
          attendeeIndices: [0, 1, 2].slice(0, group.length),
          tierId: "group_incomplete",
          label: "Complete this group of 3",
          unitPrice: 0,
          lineTotal: 0,
        },
      ];
    }
    const tier = resolveGroupLine(group.map((person) => person.participantType));
    const participantBreakdown = group.map((person) => ({
      participantType: person.participantType,
      unitPrice: resolveIndividualLine(person.participantType).unitPrice,
    }));
    return [
      {
        purchaseMode,
        attendeeIndices: [0, 1, 2],
        tierId: tier.tierId,
        label: `${tier.label} (₱${tier.discountAmount} off)`,
        unitPrice: tier.unitPrice,
        lineTotal: tier.unitPrice,
        baseTotal: tier.baseTotal,
        discountAmount: tier.discountAmount,
        participantBreakdown,
      },
    ];
  }, [attendees, purchaseMode]);

  const hasIncompleteGroup = purchaseMode === "group_of_three" && attendees.length !== 3;
  const totalAmount = computedLines.reduce((sum, line) => sum + line.lineTotal, 0);

  const updateAttendee = (index: number, key: keyof Attendee, value: string) => {
    setAttendees((current) =>
      current.map((attendee, attendeeIndex) =>
        attendeeIndex === index ? { ...attendee, [key]: value } : attendee,
      ),
    );
  };

  const syncAttendeeCountToMode = (mode: PurchaseMode) => {
    if (mode === "individual") {
      setAttendees((current) => [{ ...(current[0] ?? initialAttendee) }]);
      return;
    }
    setAttendees((current) => [
      { ...(current[0] ?? initialAttendee) },
      { ...(current[1] ?? initialAttendee) },
      { ...(current[2] ?? initialAttendee) },
    ]);
  };

  const toggleHearAbout = (value: HearAboutOption) => {
    setHearAbout((current) =>
      current.includes(value)
        ? current.filter((source) => source !== value)
        : [...current, value],
    );
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (!raw) {
        setIsHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as {
        currentStep?: number;
        purchaseMode?: PurchaseMode;
        attendees?: Attendee[];
        hearAbout?: HearAboutOption[];
        encourageFacebookFollow?: boolean;
        dataPrivacyConsent?: boolean;
        emergencyContact?: string;
        savedAt?: number;
      };
      if (parsed.currentStep) setCurrentStep(Math.min(Math.max(parsed.currentStep, 1), 4));
      if (parsed.purchaseMode) setPurchaseMode(parsed.purchaseMode);
      if (parsed.attendees?.length) setAttendees(parsed.attendees);
      if (parsed.hearAbout) setHearAbout(parsed.hearAbout);
      if (typeof parsed.encourageFacebookFollow === "boolean") {
        setEncourageFacebookFollow(parsed.encourageFacebookFollow);
      }
      if (typeof parsed.dataPrivacyConsent === "boolean") {
        setDataPrivacyConsent(parsed.dataPrivacyConsent);
      }
      if (parsed.savedAt) setLastSavedAt(parsed.savedAt);
    } catch {
      // ignore malformed draft payloads
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || successReceipt) return;
    const timer = window.setTimeout(() => {
      const payload = {
        currentStep,
        purchaseMode,
        attendees,
        hearAbout,
        encourageFacebookFollow,
        dataPrivacyConsent,
        savedAt: Date.now(),
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(payload));
      setLastSavedAt(payload.savedAt);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [
    isHydrated,
    successReceipt,
    currentStep,
    purchaseMode,
    attendees,
    hearAbout,
    encourageFacebookFollow,
    dataPrivacyConsent,
  ]);

  const onProofFileChange = (file: File | null) => {
    setProofUploadError("");
    if (!file) {
      setProofFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setProofUploadError("Payment proof must be an image file.");
      setProofFile(null);
      return;
    }
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setProofUploadError("Payment proof must be 5MB or smaller.");
      setProofFile(null);
      return;
    }
    setProofFile(file);
  };

  const getFieldPath = (index: number, key: keyof Attendee) => `attendees.${index}.${key}`;

  const getFieldError = (path: string) => fieldErrors[path];

  const getInputClass = (path: string, isDarkSurface = true) =>
    `rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent ${
      getFieldError(path)
        ? "border-tedx-accent ring-1 ring-tedx-accent"
        : "border-tedx-outline-strong"
    } ${isDarkSurface ? "bg-tedx-black" : "bg-tedx-surface"}`;

  const validateForm = (step: number) => {
    const errors: FieldErrors = {};
    const targetIndices =
      step === 1 ? [0] :
      step === 3 ? attendees.map((_, index) => index) :
      [];

    for (const index of targetIndices) {
      const attendee = attendees[index];
      if (!attendee.fullName.trim()) errors[getFieldPath(index, "fullName")] = "Required";
      if (!attendee.email.trim()) {
        errors[getFieldPath(index, "email")] = "Required";
      } else if (!isValidEmail(attendee.email)) {
        errors[getFieldPath(index, "email")] = "Invalid email";
      }
      if (!attendee.contactNumber.trim()) {
        errors[getFieldPath(index, "contactNumber")] = "Required";
      } else if (!isValidPhone(attendee.contactNumber)) {
        errors[getFieldPath(index, "contactNumber")] = "Enter at least 7 digits";
      }
      if (!attendee.schoolAffiliation.trim()) {
        errors[getFieldPath(index, "schoolAffiliation")] = "Required";
      }
    }

    if (step === 4) {
      if (!dataPrivacyConsent) {
        errors.dataPrivacyConsent = "Consent is required";
      }
      if (!proofFile) {
        errors.paymentProof = "Upload payment proof";
      }
    }

    return errors;
  };

  const validateStep = (step: number) => {
    const errors = validateForm(step);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return "Please correct the highlighted fields.";
    }
    if (step === 1 && !isAttendeeComplete(attendees[0])) {
      return "Complete your attendee details before moving to the next step.";
    }
    if (step === 3) {
      if (hasIncompleteGroup) return "Group purchase requires exactly 3 complete attendees.";
      if (attendees.some((attendee) => !isAttendeeComplete(attendee))) {
        return "Complete all attendee fields before continuing.";
      }
    }
    return "";
  };

  // For individual purchase, step 3 (Attendees) is skipped — go straight to Payment.
  const getNextStep = (step: number) => {
    if (step === 2 && purchaseMode === "individual") return 4;
    return Math.min(step + 1, 4);
  };
  const getPrevStep = (step: number) => {
    if (step === 4 && purchaseMode === "individual") return 2;
    return Math.max(step - 1, 1);
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError("");
    setCurrentStep((step) => getNextStep(step));
  };

  const prevStep = () => {
    setStepError("");
    setCurrentStep((step) => getPrevStep(step));
  };

  const uploadPaymentProof = async (): Promise<Id<"_storage">> => {
    if (!proofFile) {
      throw new Error("Please upload a payment proof image before submitting.");
    }
    const uploadUrl = await generateUploadUrl({});
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": proofFile.type },
      body: proofFile,
    });
    if (!uploadResponse.ok) {
      throw new Error("Upload failed. Please try again.");
    }
    const payload = (await uploadResponse.json()) as { storageId: string };
    if (!payload.storageId) throw new Error("Upload finished without a storage id.");
    return payload.storageId as Id<"_storage">;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");

    // Validate attendee fields
    const attendeeStep = purchaseMode === "group_of_three" ? 3 : 1;
    const attendeeError = validateStep(attendeeStep);
    if (attendeeError) {
      setSubmitMessage(attendeeError);
      setCurrentStep(attendeeStep);
      return;
    }

    // Validate payment step (consent + proof) — this is what the server enforces too
    const paymentErrors = validateForm(4);
    if (Object.keys(paymentErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...paymentErrors }));
      setCurrentStep(4);
      setSubmitMessage("Please correct the highlighted fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitPhase("uploading");
      const paymentProofStorageId = await uploadPaymentProof();
      setSubmitPhase("submitting");
      const result = await submitRegistration({
        attendees,
        encourageFacebookFollow,
        dataPrivacyConsent,
        hearAbout,
        ticketLines: computedLines.map((line) => ({
          purchaseMode: line.purchaseMode,
          attendeeIndices: line.attendeeIndices,
          resolvedTierId: line.tierId,
          unitPriceAtSubmit: line.unitPrice,
          lineTotal: line.lineTotal,
        })),
        paymentProofStorageId,
      });
      setSuccessReceipt({
        referenceCode: result.referenceCode,
        totalAmount,
        primaryName: attendees[0]?.fullName ?? "Primary attendee",
        primaryEmail: attendees[0]?.email ?? "",
        attendeeNames: attendees.map((a) => a.fullName),
      });
      setSubmitMessage("");
      localStorage.removeItem(draftStorageKey);
      setLastSavedAt(null);
      setProofFile(null);
    } catch (errorValue) {
      setSubmitMessage(
        errorValue instanceof Error
          ? errorValue.message
          : "Something went wrong during submission.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceCode = () => {
    if (!successReceipt) return;
    void navigator.clipboard.writeText(successReceipt.referenceCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (successReceipt) {
    return (
      <section className="bg-tedx-black px-4 py-8 text-tedx-white sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-6 sm:p-10">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-tedx-accent opacity-10 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-tedx-accent opacity-5 blur-3xl" aria-hidden="true" />

            <div className="relative space-y-6">
              {/* Header */}
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tedx-accent">
                  <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6" aria-hidden="true">
                    <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h1 className="mt-4 font-league-gothic text-5xl uppercase tracking-wide sm:text-6xl">
                  Registration Received
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-tedx-muted-text">
                  Thank you, <strong className="text-tedx-white">{successReceipt.primaryName}</strong>.
                  Your payment is under review — we'll confirm once verified.
                </p>
              </div>

              {/* Reference code */}
              <div className="rounded-xl border-2 border-tedx-accent bg-tedx-surface-deep p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-tedx-muted-text">
                  Reference Code
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="font-league-gothic text-4xl uppercase tracking-widest text-tedx-accent sm:text-5xl">
                    {successReceipt.referenceCode}
                  </p>
                  <button
                    type="button"
                    onClick={copyReferenceCode}
                    className="rounded-md border border-tedx-outline-strong px-3 py-1.5 text-xs font-bold uppercase transition-colors hover:border-tedx-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-tedx-muted-text">
                  Save this — you'll need it at the gate and for any support queries.
                </p>
              </div>

              {/* Summary row */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-tedx-muted-text">Amount</p>
                  <p className="mt-1 font-league-gothic text-2xl uppercase text-tedx-accent">
                    {formatPhp(successReceipt.totalAmount)}
                  </p>
                </div>
                <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-tedx-muted-text">
                    {successReceipt.attendeeNames.length === 1 ? "Attendee" : "Attendees"}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {successReceipt.attendeeNames.map((name, i) => (
                      <li key={i} className="truncate text-sm font-semibold">{name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What happens next */}
              <div className="rounded-xl border border-tedx-outline-strong bg-tedx-black p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-tedx-muted-text">
                  What happens next
                </p>
                <ol className="mt-3 space-y-3">
                  {[
                    "Our team will review your payment proof — this usually takes 1–2 business days.",
                    `Once verified, a confirmation will be sent to ${successReceipt.primaryEmail}.`,
                    "Show your reference code at the gate on event day for check-in.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-tedx-muted-text">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tedx-accent text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-4 border-t border-tedx-outline-strong pt-4 text-xs text-tedx-muted-text">
                  Questions? Email us at{" "}
                  <span className="font-bold text-tedx-white">tedxateneodemanilau@gmail.com</span>{" "}
                  with your reference code.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccessReceipt(null);
                  setCurrentStep(1);
                  setAttendees([{ ...initialAttendee }]);
                  setPurchaseMode("individual");
                  setHearAbout([]);
                  setEncourageFacebookFollow(true);
                  setDataPrivacyConsent(false);
                  setLastSavedAt(null);
                  localStorage.removeItem(draftStorageKey);
                }}
                className="text-xs font-bold uppercase text-tedx-muted-text underline-offset-2 hover:text-tedx-white hover:underline"
              >
                Submit another registration
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
      <section className="relative bg-tedx-black px-4 py-8 text-tedx-white sm:px-6 sm:py-12 lg:px-8">
      {/* Full-screen loading overlay during upload + submit */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-tedx-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-tedx-outline-strong border-t-tedx-accent" />
            <p className="mt-5 font-league-gothic text-2xl uppercase tracking-wide">
              {submitPhase === "uploading" ? "Uploading proof…" : "Submitting…"}
            </p>
            <p className="mt-1 text-xs text-tedx-muted-text">
              {submitPhase === "uploading"
                ? "Sending your payment screenshot"
                : "Saving your registration"}
            </p>
            <p className="mt-4 text-[11px] text-tedx-muted-text">Please don't close this page</p>
          </div>
        </div>
      )}
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-4 sm:p-8">
        <header className="space-y-3">
          <h1 className="font-league-gothic text-5xl uppercase tracking-wide text-balance sm:text-6xl">
            TEDx Registration
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-tedx-muted-text sm:text-base">
            One form covers one purchase only: 1 Individual Ticket or 1 Group Ticket.
          </p>
        </header>

        <div className="mt-7 rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
          <div className="relative flex items-start justify-between">
            {/* Background connector line */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-3.5 h-px bg-tedx-outline-strong"
            />
            {/* Active connector overlay */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-3.5 h-px bg-tedx-accent transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((stepLabel, stepIndex) => {
              const stepNumber = stepIndex + 1;
              const isSkipped = purchaseMode === "individual" && stepNumber === 3;
              const isComplete = !isSkipped && currentStep > stepNumber;
              const isCurrent = !isSkipped && currentStep === stepNumber;
              return (
                <div
                  key={stepLabel}
                  className={`relative z-10 flex flex-col items-center gap-1.5 transition-opacity duration-300 ${isSkipped ? "opacity-30" : ""}`}
                  style={{ width: `${100 / steps.length}%` }}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-300 ${
                      isComplete
                        ? "border-tedx-accent bg-tedx-accent text-white"
                        : isCurrent
                          ? "border-tedx-accent bg-tedx-black text-tedx-accent"
                          : "border-tedx-outline-strong bg-tedx-black text-tedx-muted-text"
                    }`}
                  >
                    {isComplete ? (
                      <svg viewBox="0 0 12 12" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={`text-center text-xs font-bold uppercase leading-tight transition-colors duration-300 ${
                      isCurrent ? "text-tedx-white" : "text-tedx-muted-text"
                    }`}
                  >
                    {stepLabel}
                    {isSkipped && <span className="block text-[10px] normal-case">skipped</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-tedx-muted-text" aria-live="polite">
          {lastSavedAt ? (
            <>
              <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 shrink-0 text-tedx-accent" aria-hidden="true">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Draft saved {formatRelativeTime(lastSavedAt, now)}
            </>
          ) : (
            "Draft not saved yet"
          )}
        </div>

        <form className="mt-8 space-y-8" onSubmit={onSubmit}>
          {currentStep === 1 && (
            <section className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1 shrink-0 self-stretch rounded-full bg-tedx-accent" aria-hidden="true" />
                <div>
                  <h2 className="font-league-gothic text-3xl uppercase tracking-wide">Step 1: Your Information</h2>
                  <p className="mt-1 text-sm text-tedx-muted-text">Add primary attendee details.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-bold uppercase text-tedx-muted-text">Full Name</span>
                  <input
                    required
                    name="fullName"
                    autoComplete="name"
                    value={attendees[0].fullName}
                    onChange={(event) => updateAttendee(0, "fullName", event.target.value)}
                    placeholder="e.g., Aquino, Vonn Andy T.…"
                    className={getInputClass(getFieldPath(0, "fullName"))}
                  />
                  {getFieldError(getFieldPath(0, "fullName")) && (
                    <p className="text-xs text-tedx-accent">{getFieldError(getFieldPath(0, "fullName"))}</p>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-bold uppercase text-tedx-muted-text">Email Address</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={attendees[0].email}
                    onChange={(event) => updateAttendee(0, "email", event.target.value)}
                    placeholder="e.g., name@school.edu…"
                    className={getInputClass(getFieldPath(0, "email"))}
                  />
                  {getFieldError(getFieldPath(0, "email")) && (
                    <p className="text-xs text-tedx-accent">{getFieldError(getFieldPath(0, "email"))}</p>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-bold uppercase text-tedx-muted-text">Contact Number</span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    name="contactNumber"
                    autoComplete="tel"
                    value={attendees[0].contactNumber}
                    onChange={(event) => updateAttendee(0, "contactNumber", event.target.value)}
                    placeholder="e.g., +63 917 123 4567…"
                    className={getInputClass(getFieldPath(0, "contactNumber"))}
                  />
                  {getFieldError(getFieldPath(0, "contactNumber")) && (
                    <p className="text-xs text-tedx-accent">{getFieldError(getFieldPath(0, "contactNumber"))}</p>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-bold uppercase text-tedx-muted-text">
                    School / Affiliation
                  </span>
                  <input
                    required
                    name="schoolAffiliation"
                    autoComplete="organization"
                    value={attendees[0].schoolAffiliation}
                    onChange={(event) =>
                      updateAttendee(0, "schoolAffiliation", event.target.value)
                    }
                    placeholder="e.g., Ateneo de Manila University…"
                    className={getInputClass(getFieldPath(0, "schoolAffiliation"))}
                  />
                  {getFieldError(getFieldPath(0, "schoolAffiliation")) && (
                    <p className="text-xs text-tedx-accent">{getFieldError(getFieldPath(0, "schoolAffiliation"))}</p>
                  )}
                </label>
                <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                  <span className="font-bold uppercase text-tedx-muted-text">Participant Type</span>
                  <select
                    name="participantType"
                    value={attendees[0].participantType}
                    onChange={(event) =>
                      updateAttendee(0, "participantType", event.target.value as ParticipantType)
                    }
                    className="rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
                  >
                    {participantTypeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1 shrink-0 self-stretch rounded-full bg-tedx-accent" aria-hidden="true" />
                <div>
                  <h2 className="font-league-gothic text-3xl uppercase tracking-wide">Step 2: Choose Ticket Type</h2>
                  <p className="mt-1 text-sm text-tedx-muted-text">Choose one mode for this submission.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {/* Individual Ticket Card */}
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseMode("individual");
                    syncAttendeeCountToMode("individual");
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent ${
                    purchaseMode === "individual"
                      ? "border-tedx-accent bg-tedx-black shadow-[0_0_20px_rgba(216,45,51,0.15)]"
                      : "border-tedx-outline-strong bg-tedx-surface hover:border-tedx-accent/50"
                  }`}
                >
                  {purchaseMode === "individual" && (
                    <span className="absolute right-3 top-3 rounded-full bg-tedx-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Selected
                    </span>
                  )}
                  <p className="font-league-gothic text-2xl uppercase tracking-wide">Individual</p>
                  <p className="mt-0.5 text-xs uppercase text-tedx-muted-text">1 Person · Solo Registration</p>
                  <div className="mt-4 space-y-1.5 border-t border-tedx-outline-strong pt-3">
                    {(["atenean", "scholar", "non_atenean"] as const).map((type) => (
                      <div key={type} className="flex justify-between text-xs">
                        <span className="text-tedx-muted-text">{pricing.participantLabels[type]}</span>
                        <span className="font-bold text-tedx-white">{formatPhp(pricing.individual[type].unitPrice)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-tedx-muted-text">Price varies by participant type</p>
                </button>

                {/* Group of Three Card */}
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseMode("group_of_three");
                    syncAttendeeCountToMode("group_of_three");
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent ${
                    purchaseMode === "group_of_three"
                      ? "border-tedx-accent bg-tedx-black shadow-[0_0_20px_rgba(216,45,51,0.15)]"
                      : "border-tedx-outline-strong bg-tedx-surface hover:border-tedx-accent/50"
                  }`}
                >
                  {purchaseMode === "group_of_three" && (
                    <span className="absolute right-3 top-3 rounded-full bg-tedx-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Selected
                    </span>
                  )}
                  <p className="font-league-gothic text-2xl uppercase tracking-wide">Group of 3</p>
                  <p className="mt-0.5 text-xs uppercase text-tedx-muted-text">3 People · You + 2 Companions</p>
                  <div className="mt-4 rounded-md bg-tedx-accent/10 px-3 py-2.5 text-center">
                    <p className="text-xs font-bold uppercase text-tedx-accent">
                      ₱{pricing.groupOfThree.discountAmount} Group Discount
                    </p>
                    <p className="mt-0.5 text-xs text-tedx-muted-text">Computed from individual rates</p>
                  </div>
                  <p className="mt-3 text-xs text-tedx-muted-text">Price computed per attendee type</p>
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1 shrink-0 self-stretch rounded-full bg-tedx-accent" aria-hidden="true" />
                  <div>
                    <h2 className="font-league-gothic text-3xl uppercase tracking-wide">Step 3: Attendee Details</h2>
                    <p className="mt-1 text-sm text-tedx-muted-text">
                      {purchaseMode === "individual"
                        ? "Individual purchase: fill in your details only."
                        : "Group purchase: fill in exactly 3 attendees."}
                    </p>
                  </div>
                </div>
                <span className="rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-xs font-bold uppercase text-tedx-muted-text">
                  {purchaseMode === "individual" ? "1 attendee" : "3 attendees"}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {attendees.map((attendee, attendeeIndex) => (
                  <div
                    key={`attendee-${attendeeIndex}`}
                    className="rounded-lg border border-tedx-outline-strong bg-tedx-black p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            attendeeIndex === 0
                              ? "bg-tedx-accent text-white"
                              : "border border-tedx-outline-strong bg-tedx-surface-deep text-tedx-muted-text"
                          }`}
                        >
                          {attendeeIndex + 1}
                        </span>
                        <p className="text-xs font-bold uppercase text-tedx-muted-text">
                          {attendeeIndex === 0 ? "Primary Attendee" : `Companion ${attendeeIndex}`}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="font-bold uppercase text-tedx-muted-text">Full Name</span>
                        <input
                          required
                          name={`attendees.${attendeeIndex}.fullName`}
                          autoComplete="name"
                          value={attendee.fullName}
                          onChange={(event) =>
                            updateAttendee(attendeeIndex, "fullName", event.target.value)
                          }
                          placeholder="e.g., Dela Cruz, Maria…"
                          className={getInputClass(getFieldPath(attendeeIndex, "fullName"), false)}
                        />
                        {getFieldError(getFieldPath(attendeeIndex, "fullName")) && (
                          <p className="text-xs text-tedx-accent">
                            {getFieldError(getFieldPath(attendeeIndex, "fullName"))}
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="font-bold uppercase text-tedx-muted-text">
                          Email Address
                        </span>
                        <input
                          required
                          type="email"
                          name={`attendees.${attendeeIndex}.email`}
                          autoComplete="email"
                          spellCheck={false}
                          value={attendee.email}
                          onChange={(event) =>
                            updateAttendee(attendeeIndex, "email", event.target.value)
                          }
                          placeholder="e.g., attendee@email.com…"
                          className={getInputClass(getFieldPath(attendeeIndex, "email"), false)}
                        />
                        {getFieldError(getFieldPath(attendeeIndex, "email")) && (
                          <p className="text-xs text-tedx-accent">
                            {getFieldError(getFieldPath(attendeeIndex, "email"))}
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="font-bold uppercase text-tedx-muted-text">
                          Contact Number
                        </span>
                        <input
                          required
                          type="tel"
                          inputMode="tel"
                          name={`attendees.${attendeeIndex}.contactNumber`}
                          autoComplete="tel"
                          value={attendee.contactNumber}
                          onChange={(event) =>
                            updateAttendee(attendeeIndex, "contactNumber", event.target.value)
                          }
                          placeholder="e.g., +63 917 000 0000…"
                          className={getInputClass(getFieldPath(attendeeIndex, "contactNumber"), false)}
                        />
                        {getFieldError(getFieldPath(attendeeIndex, "contactNumber")) && (
                          <p className="text-xs text-tedx-accent">
                            {getFieldError(getFieldPath(attendeeIndex, "contactNumber"))}
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="font-bold uppercase text-tedx-muted-text">
                          School / Affiliation
                        </span>
                        <input
                          required
                          name={`attendees.${attendeeIndex}.schoolAffiliation`}
                          autoComplete="organization"
                          value={attendee.schoolAffiliation}
                          onChange={(event) =>
                            updateAttendee(attendeeIndex, "schoolAffiliation", event.target.value)
                          }
                          placeholder="e.g., Organization or University…"
                          className={getInputClass(getFieldPath(attendeeIndex, "schoolAffiliation"), false)}
                        />
                        {getFieldError(getFieldPath(attendeeIndex, "schoolAffiliation")) && (
                          <p className="text-xs text-tedx-accent">
                            {getFieldError(getFieldPath(attendeeIndex, "schoolAffiliation"))}
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2 text-sm sm:col-span-2">
                        <span className="font-bold uppercase text-tedx-muted-text">
                          Participant Type
                        </span>
                        <select
                          name={`attendees.${attendeeIndex}.participantType`}
                          value={attendee.participantType}
                          onChange={(event) =>
                            updateAttendee(
                              attendeeIndex,
                              "participantType",
                              event.target.value as ParticipantType,
                            )
                          }
                          className="rounded-md border border-tedx-outline-strong bg-tedx-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
                        >
                          {participantTypeOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-tedx-outline-strong bg-tedx-black">
                <div className="flex items-center gap-2 border-b border-tedx-outline-strong bg-tedx-surface-deep px-4 py-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-tedx-accent" aria-hidden="true" />
                  <p className="text-xs font-bold uppercase text-tedx-muted-text">Price Summary</p>
                </div>
                <div className="divide-y divide-tedx-outline-strong p-4">
                  {computedLines.map((line, index) => (
                    <div key={`summary-${index}`} className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-bold">{line.label}</p>
                      {line.purchaseMode === "group_of_three" && line.participantBreakdown && (
                        <div className="mt-2 space-y-1.5 text-xs text-tedx-muted-text">
                          {line.participantBreakdown.map((item, itemIndex) => (
                            <div key={`breakdown-${itemIndex}`} className="flex justify-between">
                              <span>{pricing.participantLabels[item.participantType]}</span>
                              <span>{formatPhp(item.unitPrice)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPhp(line.baseTotal ?? 0)}</span>
                          </div>
                          <div className="flex justify-between text-tedx-accent">
                            <span>Group discount (₱{line.discountAmount ?? 0} off)</span>
                            <span>-{formatPhp((line.baseTotal ?? 0) - line.lineTotal)}</span>
                          </div>
                        </div>
                      )}
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="font-bold text-tedx-muted-text">Line Total</span>
                        <span className="font-bold text-tedx-accent">{formatPhp(line.lineTotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t-2 border-tedx-accent bg-tedx-surface-deep px-4 py-3">
                  <p className="text-sm font-bold uppercase text-tedx-white">Grand Total</p>
                  <p className="font-league-gothic text-2xl uppercase tracking-wide text-tedx-accent">
                    {formatPhp(totalAmount)}
                  </p>
                </div>
                {hasIncompleteGroup && (
                  <p className="border-t border-tedx-outline-strong px-4 py-2 text-xs text-tedx-accent">
                    Group purchase requires exactly 3 attendees.
                  </p>
                )}
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <>
              <section className="space-y-4 rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1 shrink-0 self-stretch rounded-full bg-tedx-accent" aria-hidden="true" />
                  <div>
                    <h2 className="font-league-gothic text-3xl uppercase tracking-wide">Step 4: Payment</h2>
                    <p className="mt-1 text-sm text-tedx-muted-text">Pay the exact amount shown in the summary using GCash, then upload proof of payment.</p>
                  </div>
                </div>
                {/* Order summary */}
                <div className="overflow-hidden rounded-xl border border-tedx-outline-strong bg-tedx-black">
                  <div className="flex items-center gap-2 border-b border-tedx-outline-strong bg-tedx-surface-deep px-4 py-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-tedx-accent" aria-hidden="true" />
                    <p className="text-xs font-bold uppercase text-tedx-muted-text">Order Summary</p>
                  </div>
                  <div className="divide-y divide-tedx-outline-strong px-4">
                    {attendees.map((attendee, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                        <div>
                          <p className="font-bold">{attendee.fullName || `Attendee ${i + 1}`}</p>
                          <p className="text-xs text-tedx-muted-text">{pricing.participantLabels[attendee.participantType]}</p>
                        </div>
                        <p className="shrink-0 font-bold text-tedx-accent">
                          {formatPhp(resolveIndividualLine(attendee.participantType).unitPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t-2 border-tedx-accent bg-tedx-surface-deep px-4 py-3">
                    <p className="text-sm font-bold uppercase text-tedx-white">
                      Total{purchaseMode === "group_of_three" ? ` (₱${pricing.groupOfThree.discountAmount} group discount)` : ""}
                    </p>
                    <p className="font-league-gothic text-2xl uppercase tracking-wide text-tedx-accent">
                      {formatPhp(totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-xs overflow-hidden rounded-xl border border-tedx-outline-strong bg-tedx-white p-3">
                  <Image
                    src="/gcash.png"
                    alt="GCash payment QR code"
                    width={600}
                    height={600}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-tedx-muted-text">
                    Upload Payment Proof
                  </p>
                  <label
                    htmlFor="paymentProofInput"
                    className={`group flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                      proofFile
                        ? "border-tedx-accent bg-tedx-accent/5"
                        : getFieldError("paymentProof")
                          ? "border-tedx-accent bg-tedx-accent/5"
                          : "border-tedx-outline-strong bg-tedx-black hover:border-tedx-accent/50 hover:bg-tedx-surface"
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      onProofFileChange(e.dataTransfer.files?.[0] ?? null);
                    }}
                  >
                    {proofFile ? (
                      <>
                        <img
                          src={URL.createObjectURL(proofFile)}
                          alt="Payment proof preview"
                          className="max-h-32 max-w-full rounded-md object-contain"
                        />
                        <p className="text-xs text-tedx-muted-text">{proofFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            onProofFileChange(null);
                          }}
                          className="text-xs font-bold uppercase text-tedx-accent hover:text-tedx-accent-hover"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`h-8 w-8 transition-colors ${
                            getFieldError("paymentProof")
                              ? "text-tedx-accent"
                              : "text-tedx-muted-text group-hover:text-tedx-white"
                          }`}
                          aria-hidden="true"
                        >
                          <path
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-tedx-white">Drop your screenshot here</p>
                          <p className="mt-0.5 text-xs text-tedx-muted-text">
                            or click to browse · JPG, PNG, WEBP · max 5 MB
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                  <input
                    id="paymentProofInput"
                    name="paymentProof"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => onProofFileChange(event.target.files?.[0] ?? null)}
                    aria-label="Upload payment proof"
                  />
                  {getFieldError("paymentProof") && (
                    <p className="mt-2 text-xs text-tedx-accent">{getFieldError("paymentProof")}</p>
                  )}
                  {proofUploadError && (
                    <p className="mt-2 text-xs text-tedx-accent">{proofUploadError}</p>
                  )}
                </div>
              </section>

              <section className="space-y-4 rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-1 shrink-0 self-stretch rounded-full bg-tedx-accent" aria-hidden="true" />
                  <div>
                    <h2 className="font-league-gothic text-3xl uppercase tracking-wide">Additional Details</h2>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold uppercase">
                    How did you hear about the event?
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {hearAboutOptions.map((option) => (
                      <label key={option.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                        <StyledCheckbox
                          checked={hearAbout.includes(option.id)}
                          onChange={() => toggleHearAbout(option.id)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <StyledCheckbox
                    checked={encourageFacebookFollow}
                    onChange={(checked) => setEncourageFacebookFollow(checked)}
                  />
                  <span>I will follow TEDxAteneodeManilaU on Facebook for event updates.</span>
                </label>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <StyledCheckbox
                    checked={dataPrivacyConsent}
                    onChange={(checked) => setDataPrivacyConsent(checked)}
                  />
                  <span className={dataPrivacyConsent ? "text-tedx-white" : "text-tedx-muted-text"}>
                    I agree to the collection and processing of my data for registration.
                    {!dataPrivacyConsent && <span className="ml-1 text-tedx-accent" aria-hidden="true">*</span>}
                  </span>
                </label>
                {getFieldError("dataPrivacyConsent") && (
                  <p className="text-xs text-tedx-accent">{getFieldError("dataPrivacyConsent")}</p>
                )}
              </section>
            </>
          )}

          {stepError && <p className="text-sm text-tedx-accent">{stepError}</p>}
          <p aria-live="polite" className="text-sm text-tedx-muted-text">
            {submitMessage}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-tedx-outline-strong pt-5">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="rounded-md border border-tedx-outline-strong px-4 py-2 text-xs font-bold uppercase transition-colors hover:border-tedx-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent disabled:cursor-not-allowed disabled:text-tedx-disabled-text"
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-md bg-tedx-accent px-4 py-2 text-xs font-bold uppercase transition-colors hover:bg-tedx-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-tedx-accent px-4 py-2 text-xs font-bold uppercase transition-colors hover:bg-tedx-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent disabled:cursor-not-allowed disabled:bg-tedx-disabled"
              >
                {isSubmitting ? "Submitting…" : "Submit Registration"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}