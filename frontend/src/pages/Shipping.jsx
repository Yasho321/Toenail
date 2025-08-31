import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
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
          <h1 className="text-3xl font-bold text-primary mb-6">Shipping Information</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Digital Service - No Physical Shipping</h2>
              <p className="mb-4">
                ToeNail is a digital service that provides AI-generated YouTube thumbnails. Since our service is entirely digital, there is no physical shipping involved.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Token Delivery</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tokens are instantly credited to your account upon successful payment</li>
                <li>You'll receive email confirmation of your purchase</li>
                <li>Tokens are immediately available for use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Thumbnail Delivery</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Generated thumbnails are available instantly upon creation</li>
                <li>Download links are provided in high-resolution formats</li>
                <li>All thumbnails are stored in your account for easy access</li>
                <li>Bulk download options available for multiple thumbnails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Access & Availability</h2>
              <p className="mb-4">
                Our service is available 24/7 through our web platform. You can access your account and generate thumbnails anytime, anywhere with an internet connection.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Technical Requirements</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>Stable internet connection</li>
                <li>JavaScript enabled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Support</h2>
              <p>
                If you experience any issues with accessing your tokens or generated thumbnails, please contact our support team at support@toenail.com for immediate assistance.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;