import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
          <h1 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <h3 className="font-semibold text-foreground mb-2">Personal Information:</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name and email address (for account creation)</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Usage data and preferences</li>
              </ul>
              <h3 className="font-semibold text-foreground mb-2">Content Data:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Images uploaded for thumbnail generation</li>
                <li>Generated thumbnails and related metadata</li>
                <li>Chat conversations and prompts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our AI thumbnail generation service</li>
                <li>Process payments and manage your token balance</li>
                <li>Send service updates and support communications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All data is encrypted in transit and at rest</li>
                <li>Images and thumbnails are stored securely on our servers</li>
                <li>Payment data is processed by Razorpay and not stored by us</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing</h2>
              <p className="mb-4">We do not sell or rent your personal information. We may share data only in these circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>With trusted service providers (under strict confidentiality agreements)</li>
                <li>In case of business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies & Tracking</h2>
              <p className="mb-4">We use essential cookies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication and session management</li>
                <li>User preferences and settings</li>
                <li>Analytics to improve our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account data: Retained while account is active</li>
                <li>Generated thumbnails: Stored for 1 year after creation</li>
                <li>Chat history: Retained for service improvement purposes</li>
                <li>Payment records: Retained for 7 years for legal compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, contact us at privacy@toenail.com.
              </p>
            </section>

            <p className="text-sm mt-8">Last updated: August 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;