import pricingJson from "@/config/ticket-pricing.json";

export type ParticipantType = "atenean" | "scholar" | "non_atenean";
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
    discountAmount: number;
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

  const computedTotal = baseTotal - pricing.groupOfThree.discountAmount;

  return {
    tierId: pricing.groupOfThree.tierId,
    label: pricing.groupOfThree.label,
    unitPrice: computedTotal,
    baseTotal,
    discountAmount: pricing.groupOfThree.discountAmount,
  };
}

export function formatPhp(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}
