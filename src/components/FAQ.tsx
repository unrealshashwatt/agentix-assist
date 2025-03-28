
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How does TaxAI's technology work?",
    answer: "TaxAI combines artificial intelligence with tax expertise to guide you through your return. Our AI analyzes your financial information, identifies deductions, and helps you navigate complex tax scenarios through simple conversations in plain English."
  },
  {
    question: "Is TaxAI secure and private?",
    answer: "Absolutely. We use bank-level 256-bit encryption to protect your data and comply with all IRS security standards. Your information is never sold to third parties, and our systems are regularly audited for security compliance."
  },
  {
    question: "Can TaxAI handle complex tax situations?",
    answer: "Yes. TaxAI is designed to handle both simple and complex tax scenarios. Whether you're a W-2 employee, self-employed, have rental income, investments, or multiple sources of income, our AI can guide you through the process."
  },
  {
    question: "What if I need human support?",
    answer: "While our AI handles most questions, we have tax professionals available to assist with complex situations. Premium and Business plans include direct access to human tax experts via chat or video call."
  },
  {
    question: "What tax forms does TaxAI support?",
    answer: "TaxAI supports all common tax forms including 1040 (and all schedules), 1099-MISC, 1099-K, 1099-NEC, W-2, Schedule C, Schedule E, and many more. We're constantly adding support for additional forms."
  },
  {
    question: "How much does TaxAI cost?",
    answer: "TaxAI offers several pricing tiers starting with a free option for simple returns. Our Premium plan ($49) covers more complex situations, and our Business plan ($99) includes features for self-employed individuals and small businesses. All plans include our AI assistance."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about our AI-powered tax assistance.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-lg hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
