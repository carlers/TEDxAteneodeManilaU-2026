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
  discountRate?: number;
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
  { id: "student", label: "Student" },
  { id: "aman_scholar", label: "AMAn / Scholar" },
  { id: "external", label: "External" },
] as const;

const initialAttendee: Attendee = {
  fullName: "",
  email: "",
  contactNumber: "",
  schoolAffiliation: "",
  participantType: "student",
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
  const [emergencyContact, setEmergencyContact] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUploadError, setProofUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [stepError, setStepError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successReceipt, setSuccessReceipt] = useState<SuccessReceipt | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

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
        label: `${tier.label} (${Math.round(tier.discountRate * 100)}% off)`,
        unitPrice: tier.unitPrice,
        lineTotal: tier.unitPrice,
        baseTotal: tier.baseTotal,
        discountRate: tier.discountRate,
        participantBreakdown,
      },
    ];
  }, [attendees, purchaseMode]);

  const hasIncompleteGroup = purchaseMode === "group_of_three" && attendees.length !== 3;
  const totalAmount = computedLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const progressPercent = (currentStep / steps.length) * 100;

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

  const removeAttendee = (index: number) => {
    if (purchaseMode === "group_of_three") return;
    if (index !== 0) return;
    setAttendees([{ ...initialAttendee }]);
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
      if (typeof parsed.emergencyContact === "string") setEmergencyContact(parsed.emergencyContact);
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
        emergencyContact,
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
    emergencyContact,
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
    const targetIndices = step === 1 ? [0] : attendees.map((_, index) => index);

    for (const index of targetIndices) {
      const attendee = attendees[index];
      if (!attendee.fullName.trim()) errors[getFieldPath(index, "fullName")] = "Required";
      if (!attendee.email.trim()) {
        errors[getFieldPath(index, "email")] = "Required";
      } else if (!isValidEmail(attendee.email)) {
        errors[getFieldPath(index, "email")] = "Invalid email";
      }
      if (!attendee.contactNumber.trim()) errors[getFieldPath(index, "contactNumber")] = "Required";
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

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError("");
    setCurrentStep((step) => Math.min(step + 1, 4));
  };

  const prevStep = () => {
    setStepError("");
    setCurrentStep((step) => Math.max(step - 1, 1));
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

    const error = validateStep(3);
    if (error) {
      setSubmitMessage(error);
      setCurrentStep(3);
      return;
    }

    try {
      setIsSubmitting(true);
      const paymentProofStorageId = await uploadPaymentProof();
      const result = await submitRegistration({
        attendees,
        encourageFacebookFollow,
        dataPrivacyConsent,
        emergencyContact: emergencyContact || undefined,
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

  if (successReceipt) {
    return (
      <section className="bg-tedx-black px-4 py-8 text-tedx-white sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-5 sm:p-10">
          <h1 className="font-league-gothic text-5xl uppercase tracking-wide text-balance sm:text-6xl">
            Registration Received
          </h1>
          <p className="mt-3 text-sm text-tedx-muted-text sm:text-base">
            Thank you, {successReceipt.primaryName}. Your submission is now in our queue for
            review.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-4">
              <p className="text-xs font-bold uppercase text-tedx-muted-text">
                Reference Number
              </p>
              <p className="mt-2 text-lg font-bold text-tedx-accent">
                {successReceipt.referenceCode}
              </p>
            </div>
            <div className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-4">
              <p className="text-xs font-bold uppercase text-tedx-muted-text">Amount Submitted</p>
              <p className="mt-2 text-lg font-bold">{formatPhp(successReceipt.totalAmount)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-tedx-outline-strong bg-tedx-black p-5">
            <p className="text-sm text-tedx-muted-text">
              A confirmation message will be sent to:
            </p>
            <p className="mt-1 text-sm font-bold">{successReceipt.primaryEmail}</p>
            <p className="mt-4 text-sm text-tedx-muted-text">
              Need help? Contact the team with your reference number:
            </p>
            <p className="mt-1 text-sm font-bold">Email: tedxateneodemanilau@gmail.com</p>
            <p className="text-sm font-bold">Phone: +63 917 000 0000</p>
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
              setEmergencyContact("");
              setLastSavedAt(null);
              localStorage.removeItem(draftStorageKey);
            }}
            className="mt-6 rounded-md bg-tedx-accent px-4 py-2 text-xs font-bold uppercase transition-colors hover:bg-tedx-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
          >
            Submit Another Registration
          </button>
        </div>
      </section>
    );
  }

  return (
      <section className="bg-tedx-black px-4 py-8 text-tedx-white sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-tedx-outline-strong bg-tedx-surface p-4 sm:p-8">
        <header className="space-y-3">
          <h1 className="font-league-gothic text-5xl uppercase tracking-wide text-balance sm:text-6xl">
            TEDx Registration
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-tedx-muted-text sm:text-base">
            One form covers one purchase only: 1 Individual Ticket or 1 Group Ticket.
          </p>
        </header>

        <div className="mt-7 rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase text-tedx-muted-text">
              {steps[currentStep - 1]} - Step {currentStep} of {steps.length}
            </p>
            <p className="text-xs font-bold uppercase text-tedx-muted-text">
              {Math.round(progressPercent)}%
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-tedx-black">
            <div
              className="h-full rounded-full bg-tedx-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-3 min-h-5 text-xs text-tedx-muted-text" aria-live="polite">
          {lastSavedAt
            ? `Autosaved ${new Date(lastSavedAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}`
            : "Draft not saved yet"}
        </div>

        <form className="mt-8 space-y-8" onSubmit={onSubmit}>
          {currentStep === 1 && (
            <section className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              <h2 className="text-2xl font-bold uppercase">Step 1: Your Information</h2>
              <p className="mt-1 text-sm text-tedx-muted-text">
                Add primary attendee details.
              </p>
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
              <h2 className="text-2xl font-bold uppercase">Step 2: Choose Ticket Type</h2>
              <p className="mt-1 text-sm text-tedx-muted-text">
                Choose one mode for this submission.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseMode("individual");
                    syncAttendeeCountToMode("individual");
                  }}
                  className={`rounded-lg border p-4 text-left ${
                    purchaseMode === "individual"
                      ? "border-tedx-accent bg-tedx-black"
                      : "border-tedx-outline-strong bg-tedx-surface"
                  }`}
                >
                  <p className="text-sm font-bold uppercase">Individual Ticket (1 Person)</p>
                  <p className="mt-1 text-xs text-tedx-muted-text">
                    For solo registration.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseMode("group_of_three");
                    syncAttendeeCountToMode("group_of_three");
                  }}
                  className={`rounded-lg border p-4 text-left ${
                    purchaseMode === "group_of_three"
                      ? "border-tedx-accent bg-tedx-black"
                      : "border-tedx-outline-strong bg-tedx-surface"
                  }`}
                >
                  <p className="text-sm font-bold uppercase">Group Ticket (3 People)</p>
                  <p className="mt-1 text-xs text-tedx-muted-text">
                    For you + 2 companions.
                  </p>
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold uppercase">Step 3: Attendee Details</h2>
                  <p className="mt-1 text-sm text-tedx-muted-text">
                    {purchaseMode === "individual"
                      ? "Individual purchase: fill in your details only."
                      : "Group purchase: fill in exactly 3 attendees."}
                  </p>
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
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase text-tedx-muted-text">
                        {attendeeIndex === 0 ? "Primary Attendee" : `Companion ${attendeeIndex}`}
                      </p>
                      {purchaseMode === "individual" && (
                        <button
                          type="button"
                          onClick={() => removeAttendee(attendeeIndex)}
                          className="text-xs font-bold uppercase text-tedx-accent hover:text-tedx-accent-hover"
                        >
                          Remove
                        </button>
                      )}
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

              <div className="mt-5 rounded-lg border border-tedx-outline-strong bg-tedx-black p-4">
                <p className="text-xs font-bold uppercase text-tedx-muted-text">Price Summary</p>
                <div className="mt-2 space-y-1">
                  {computedLines.map((line, index) => (
                    <div
                      key={`summary-${index}`}
                      className="rounded-md border border-tedx-outline-strong bg-tedx-surface p-3 text-sm"
                    >
                      <p className="font-bold">{line.label}</p>
                      {line.purchaseMode === "group_of_three" && line.participantBreakdown && (
                        <div className="mt-2 space-y-1 text-xs text-tedx-muted-text">
                          {line.participantBreakdown.map((item, itemIndex) => (
                            <p key={`breakdown-${itemIndex}`}>
                              {pricing.participantLabels[item.participantType]}:{" "}
                              {formatPhp(item.unitPrice)}
                            </p>
                          ))}
                          <p>Subtotal: {formatPhp(line.baseTotal ?? 0)}</p>
                          <p>
                            Discount ({Math.round((line.discountRate ?? 0) * 100)}%): -
                            {formatPhp((line.baseTotal ?? 0) - line.lineTotal)}
                          </p>
                        </div>
                      )}
                      <p className="mt-2 font-bold text-tedx-accent">
                        Total: {formatPhp(line.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm font-bold uppercase text-tedx-accent">
                  Total: {formatPhp(totalAmount)}
                </p>
                {hasIncompleteGroup && (
                  <p className="mt-2 text-xs text-tedx-accent">
                    Group purchase requires exactly 3 attendees.
                  </p>
                )}
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <>
              <section className="space-y-4 rounded-xl border border-tedx-outline-strong bg-tedx-surface-deep p-5">
                <h2 className="text-2xl font-bold uppercase">Step 4: Payment</h2>
                <p className="text-sm text-tedx-muted-text">
                  Pay the exact amount shown in the summary using GCash, then upload proof of
                  payment.
                </p>
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
                  <label className="mb-2 block text-xs font-bold uppercase text-tedx-muted-text">
                    Upload Payment Proof
                  </label>
                  <input
                    required
                    name="paymentProof"
                    type="file"
                    accept="image/*"
                    onChange={(event) => onProofFileChange(event.target.files?.[0] ?? null)}
                    className="block w-full text-sm"
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
                <h2 className="text-2xl font-bold uppercase">Additional Details</h2>
                <div>
                  <p className="mb-2 text-sm font-bold uppercase">
                    How did you hear about the event?
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {hearAboutOptions.map((option) => (
                      <label key={option.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={hearAbout.includes(option.id)}
                          onChange={() => toggleHearAbout(option.id)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                <input
                  name="emergencyContact"
                  autoComplete="off"
                  value={emergencyContact}
                  onChange={(event) => setEmergencyContact(event.target.value)}
                  placeholder="Emergency contact (optional)…"
                  className="w-full rounded-md border border-tedx-outline-strong bg-tedx-black px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tedx-accent"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={encourageFacebookFollow}
                    onChange={(event) => setEncourageFacebookFollow(event.target.checked)}
                  />
                  I will follow TEDxAteneodeManilaU on Facebook for event updates.
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={dataPrivacyConsent}
                    onChange={(event) => setDataPrivacyConsent(event.target.checked)}
                    required
                  />
                  I agree to the collection and processing of my data for registration.
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