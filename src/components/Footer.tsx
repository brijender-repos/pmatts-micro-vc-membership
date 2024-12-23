import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { NewsletterSubscription } from "./NewsletterSubscription";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-medium">About PMatts</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Empowering communities through innovation and responsibility.
            </p>
            <div className="mt-4">
              <Link to="/faqs" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Frequently Asked Questions
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Newsletter</h3>
            <NewsletterSubscription />
          </div>
          <div>
            <h3 className="text-lg font-medium">Contact</h3>
            <div className="mt-2 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                email@pmattscatalysts.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 8008 107 889
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 PMatts Innovative Catalysts Federation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};