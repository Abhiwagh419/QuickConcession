import { ShieldCheck } from "lucide-react";
import LegalPageLayout from "@/components/LegalPageLayout";
import { PRIVACY_POLICY } from "@/content/legal";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="How QuickConcession collects, uses, and protects your information as a student, staff, or admin of Government Polytechnic Mumbai."
      icon={ShieldCheck}
      sections={PRIVACY_POLICY}
    />
  );
};

export default PrivacyPolicy;
