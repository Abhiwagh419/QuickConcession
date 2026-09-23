"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEligibility = checkEligibility;
const knowledgeBase_1 = require("./knowledgeBase");
function normalize(value) {
    return value.trim().toLowerCase();
}
// Eligibility is intentionally simple: any actively enrolled student of the
// institution is eligible, regardless of category. There is no
// caste/reservation category check here — see the note in knowledgeBase.ts
// for why that field was removed.
function checkEligibility(input) {
    const reasons = [];
    const institutionMatches = normalize(input.institution) === normalize(knowledgeBase_1.eligibilityCriteria.institution);
    if (!institutionMatches) {
        reasons.push(`This portal is for students of "${knowledgeBase_1.eligibilityCriteria.institution}". If you study elsewhere, this system can't process your application.`);
    }
    const yearMatches = knowledgeBase_1.eligibilityCriteria.allowedYears === "any" ||
        knowledgeBase_1.eligibilityCriteria.allowedYears.includes(input.year);
    if (!yearMatches) {
        reasons.push("Year of study is not within the eligible range.");
    }
    return {
        eligible: institutionMatches && yearMatches,
        reasons,
        isPlaceholderPolicy: knowledgeBase_1.eligibilityCriteria.isPlaceholder,
    };
}
