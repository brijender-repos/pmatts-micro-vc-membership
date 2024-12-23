import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import faqData from "@/data/faqs.json";

export const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredFAQs = faqData.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container px-4 md:px-6">
        <Button
          variant="ghost"
          className="mb-6 -ml-4 text-muted-foreground hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] sm:text-5xl md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Find answers to common questions about PMatts Innovative Catalysts Federation
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            type="search"
            placeholder="Search FAQs..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No FAQs found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQs;