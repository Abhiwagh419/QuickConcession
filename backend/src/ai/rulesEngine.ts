import { eligibilityCriteria } from "./knowledgeBase";

export interface EligibilityInput {
  institution: string;
  year: number;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  isPlaceholderPolicy: boolean;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

// Eligibility is intentionally simple: any actively enrolled student of the
// institution is eligible, regardless of category. There is no
// caste/reservation category check here — see the note in knowledgeBase.ts
// for why that field was removed.
export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];

  const institutionMatches =
    normalize(input.institution) === normalize(eligibilityCriteria.institution);

  if (!institutionMatches) {
    reasons.push(
      `This portal is for students of "${eligibilityCriteria.institution}". If you study elsewhere, this system can't process your application.`,
    );
  }

  const yearMatches =
    eligibilityCriteria.allowedYears === "any" ||
    eligibilityCriteria.allowedYears.includes(input.year);

  if (!yearMatches) {
    reasons.push("Year of study is not within the eligible range.");
  }

  return {
    eligible: institutionMatches && yearMatches,
    reasons,
    isPlaceholderPolicy: eligibilityCriteria.isPlaceholder,
  };
}
