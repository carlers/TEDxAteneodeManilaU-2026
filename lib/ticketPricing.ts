import pricingJson from "@/config/ticket-pricing.json";

export type ParticipantType = "student" | "aman_scholar" | "external";
export type PurchaseMode = "individual" | "group_of_three";

type TierPricing = {
  tierId: string;
  label: string;
  unitPrice: number;
};

type PricingConfig = {
  currency: string;
  participantLabels: Record<ParticipantType, string>;
  individual: Record<ParticipantType, TierPricing>;
  groupOfThree: {
    tierId: string;
    label: string;
    discountRate: number;
  };
};

const pricing = pricingJson as PricingConfig;

export function getPricingConfig() {
  return pricing;
}

export function resolveIndividualLine(participantType: ParticipantType) {
  return pricing.individual[participantType];
}

function validateGroupParticipants(participantTypes: ParticipantType[]) {
  if (participantTypes.length !== 3) {
    throw new Error("Group-of-three pricing requires exactly 3 participants.");
  }
}

export function resolveGroupLine(participantTypes: ParticipantType[]) {
  validateGroupParticipants(participantTypes);

  const baseTotal = participantTypes.reduce((sum, participantType) => {
    return sum + pricing.individual[participantType].unitPrice;
  }, 0);

  const discountMultiplier = 1 - pricing.groupOfThree.discountRate;
  const computedTotal = Math.round(baseTotal * discountMultiplier);

  return {
    tierId: pricing.groupOfThree.tierId,
    label: pricing.groupOfThree.label,
    unitPrice: computedTotal,
    baseTotal,
    discountRate: pricing.groupOfThree.discountRate,
  };
}

export function formatPhp(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}
