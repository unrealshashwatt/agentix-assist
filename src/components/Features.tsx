
import { 
  BrainCircuit, 
  Calculator, 
  Clock, 
  FileText, 
  Shield, 
  TrendingUp
} from 'lucide-react';

const featureItems = [
  {
    icon: <BrainCircuit size={36} className="text-taxblue-500" />,
    title: "AI-Powered Assistance",
    description: "Our intelligent tax assistant answers questions in plain language and guides you through complex tax situations."
  },
  {
    icon: <Calculator size={36} className="text-taxblue-500" />,
    title: "Maximum Deductions",
    description: "Our system automatically identifies all eligible deductions and credits to minimize your tax liability."
  },
  {
    icon: <Shield size={36} className="text-taxblue-500" />,
    title: "Audit Protection",
    description: "Get peace of mind with our audit defense guarantee and real-time accuracy checks."
  },
  {
    icon: <FileText size={36} className="text-taxblue-500" />,
    title: "Document Scanner",
    description: "Easily upload tax documents with your phone camera and our AI will extract the data automatically."
  },
  {
    icon: <Clock size={36} className="text-taxblue-500" />,
    title: "Time Saving",
    description: "Complete your taxes in minutes, not hours. Our streamlined process eliminates the usual frustrations."
  },
  {
    icon: <TrendingUp size={36} className="text-taxblue-500" />,
    title: "Year-Round Tax Planning",
    description: "Get proactive tax advice throughout the year to optimize your financial decisions."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">AI-Powered</span> Tax Return Features
          </h2>
          <p className="text-gray-600 text-lg">
            Our intelligent platform simplifies the tax filing process while maximizing your refund.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group hover:border-taxblue-100 hover:translate-y-[-5px] transition-all duration-300"
            >
              <div className="mb-4 p-2 w-16 h-16 flex items-center justify-center rounded-lg bg-taxblue-50 group-hover:bg-taxblue-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
