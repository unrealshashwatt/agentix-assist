
import { Button } from '@/components/ui/button';
import { CheckCircle2, CircleUser, FileText, Upload } from 'lucide-react';

const processSteps = [
  {
    id: 1,
    icon: <CircleUser size={32} className="text-white" />,
    title: "Create Your Account",
    description: "Sign up in seconds and tell us a bit about your tax situation.",
    color: "bg-taxblue-500"
  },
  {
    id: 2,
    icon: <Upload size={32} className="text-white" />,
    title: "Upload Documents",
    description: "Snap photos of your tax documents or connect to import them electronically.",
    color: "bg-taxgreen-500"
  },
  {
    id: 3,
    icon: <CheckCircle2 size={32} className="text-white" />,
    title: "Answer Simple Questions",
    description: "Our AI assistant will ask straightforward questions about your situation.",
    color: "bg-taxblue-500"
  },
  {
    id: 4,
    icon: <FileText size={32} className="text-white" />,
    title: "Review & File",
    description: "Review your return, submit electronically, and get your refund fast.",
    color: "bg-taxgreen-500"
  }
];

const Process = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How TaxAI Works</h2>
          <p className="text-gray-600 text-lg">
            Our streamlined process makes filing taxes simpler than ever before.
          </p>
        </div>
        
        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                  {step.icon}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md w-full">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" className="bg-taxblue-500 hover:bg-taxblue-600">
            Start Your Tax Return
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Process;
