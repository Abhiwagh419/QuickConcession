import { FileText } from "lucide-react";
import LegalPageLayout from "@/components/LegalPageLayout";
import { TERMS_OF_SERVICE } from "@/content/legal";

const TermsOfService = () => {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      description="The terms that govern your use of QuickConcession, including how concession applications and the QuickChat AI assistant work."
      icon={FileText}
      sections={TERMS_OF_SERVICE}
    />
  );
};

export default TermsOfService;
