import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Terms and Conditions</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using ToeNail's services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Description</h2>
              <p>
                ToeNail provides AI-powered YouTube thumbnail generation services. Users purchase tokens to generate custom thumbnails using our AI technology.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users must provide accurate information when creating accounts</li>
                <li>Users are responsible for maintaining account security</li>
                <li>One account per user is permitted</li>
                <li>We reserve the right to suspend accounts for violations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Token System</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tokens are consumed upon thumbnail generation</li>
                <li>Tokens do not expire but are non-transferable</li>
                <li>Failed generations may result in token refunds at our discretion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Content Guidelines</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users must not upload illegal, offensive, or copyrighted content</li>
                <li>Generated thumbnails are for personal/commercial use only</li>
                <li>We reserve the right to remove inappropriate content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
              <p>
                ToeNail shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.
              </p>
            </section>

            <p className="text-sm mt-8">Last updated: August 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;