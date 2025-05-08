
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    // Simulate form submission
    setLoading(true);
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?" 
                      className="min-h-[150px]" 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Our Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Address</h3>
                      <p className="text-gray-600">123 Healthcare Blvd<br />Medical District, MD 20814</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact</h3>
                      <p className="text-gray-600">contact@healthcare-platform.com<br />(555) 123-4567</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 8:00 PM<br />
                        Saturday: 9:00 AM - 5:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t">
                  <p className="text-primary font-medium">Need urgent assistance?</p>
                  <p className="text-gray-600">Call our 24/7 support line: (555) 999-8888</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
