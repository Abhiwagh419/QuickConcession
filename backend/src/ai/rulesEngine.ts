import { eligibilityCriteria } from "./knowledgeBase";

export interface EligibilityInput {
  institution: string;
  year: number;
  category: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  isPlaceholderPolicy: boolean;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];

  const institutionMatches =
    normalize(input.institution) === normalize(eligibilityCriteria.institution);

  if (!institutionMatches) {
    reasons.push(
      `Institution must be "${eligibilityCriteria.institution}".`,
    );
  }

  const yearMatches =
    eligibilityCriteria.allowedYears === "any" ||
    eligibilityCriteria.allowedYears.includes(input.year);

  if (!yearMatches) {
    reasons.push("Year of study is not within the eligible range.");
  }

  const categoryMatches = eligibilityCriteria.allowedCategories.some(
    (allowed) => normalize(allowed) === normalize(input.category),
  );

  if (!categoryMatches) {
    reasons.push(
      `Category must be one of: ${eligibilityCriteria.allowedCategories.join(", ")}.`,
    );
  }

  return {
    eligible: institutionMatches && yearMatches && categoryMatches,
    reasons,
    isPlaceholderPolicy: eligibilityCriteria.isPlaceholder,
  };
}
