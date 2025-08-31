import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CancellationRefunds = () => {
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
          <h1 className="text-3xl font-bold text-primary mb-6">Cancellation & Refunds</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Token Refund Policy</h2>
              <p className="mb-4">
                Due to the nature of our AI-powered thumbnail generation service, tokens are considered digital goods that are consumed upon use. However, we understand that exceptional circumstances may arise.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unused tokens may be refunded within 7 days of purchase</li>
                <li>Refunds are processed within 5-7 business days</li>
                <li>Service disruptions lasting more than 24 hours qualify for token credits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cancellation Process</h2>
              <p className="mb-4">
                You can cancel your account at any time by contacting our support team. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account will be deactivated within 24 hours</li>
                <li>Unused tokens will be forfeited unless refund criteria are met</li>
                <li>All generated thumbnails remain accessible for 30 days post-cancellation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Quality Guarantee</h2>
              <p>
                If you're not satisfied with the quality of generated thumbnails, contact us within 24 hours of creation. We'll work with you to resolve any issues or provide token credits where appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact for Refunds</h2>
              <p>
                For refund requests, please contact us at support@toenail.com with your order details and reason for refund.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefunds;