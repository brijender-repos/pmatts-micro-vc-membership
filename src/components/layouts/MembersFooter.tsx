import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export const MembersFooter = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Quick Links */}
          <div className="space-y-4">
            <nav>
              <h4 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/faqs" 
                    className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:email@pmattscatalysts.com" 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                email@pmattscatalysts.com
              </a>
              <a 
                href="tel:+918008107889" 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 8008 107 889
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 PMatts Innovative Catalysts Federation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};