import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
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
          <h1 className="text-3xl font-bold text-primary mb-6">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted-foreground mb-6">
                  We're here to help! Reach out to us for any questions, support, or feedback about ToeNail.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Email Support</p>
                      <p className="text-muted-foreground">support@toenail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Live Chat</p>
                      <p className="text-muted-foreground">Available in dashboard</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Response Time</p>
                      <p className="text-muted-foreground">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Business Hours</h2>
                <div className="text-muted-foreground space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                  <p>Sunday: Closed</p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">How do tokens work?</h3>
                    <p className="text-muted-foreground">Each thumbnail generation consumes 1 token. Tokens don't expire and can be purchased in various packages.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">What image formats are supported?</h3>
                    <p className="text-muted-foreground">We support JPG, PNG, and WebP formats for uploads and downloads.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Can I get a refund?</h3>
                    <p className="text-muted-foreground">Unused tokens can be refunded within 7 days of purchase. See our refund policy for details.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Report Issues</h2>
                <p className="text-muted-foreground mb-4">
                  Experiencing technical problems? Send us detailed information including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Browser and version</li>
                  <li>Steps to reproduce the issue</li>
                  <li>Error messages (if any)</li>
                  <li>Screenshots (if applicable)</li>
                </ul>
              </section>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <p>ToeNail Technologies Pvt. Ltd. | India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;