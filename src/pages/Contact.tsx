import { Footer } from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Have questions about our projects or want to get involved? We'd love to hear from you.
            </p>
            <div className="space-y-2">
              <p>Email: email@pmattscatalysts.com</p>
              <p>Phone: +91 8008 107 889</p>
              <p>Address: Hyderabad, Telangana, India</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
            <p className="text-muted-foreground">
              Monday - Friday: 9:00 AM - 6:00 PM IST<br />
              Saturday: 9:00 AM - 1:00 PM IST<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}