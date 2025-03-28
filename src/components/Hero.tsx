
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Tax Returns Made <span className="gradient-text">Simple</span> With AI Assistance
            </h1>
            <p className="text-lg text-gray-600 md:pr-12">
              Our AI-powered platform guides you through your tax return, maximizing deductions and ensuring compliance with the latest tax laws.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-taxblue-500 hover:bg-taxblue-600 text-white font-medium">
                Get Started Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-taxblue-500 text-taxblue-500 hover:bg-taxblue-50">
                See How It Works
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                    {['JD', 'SM', 'RK', 'AT'][i]}
                  </div>
                ))}
              </div>
              <p>Join 10,000+ users who trust TaxAI</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-taxblue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-soft"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-taxgreen-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-soft"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-float">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-taxblue-500 p-2 rounded-lg text-white ai-glow">
                  <BrainCircuit size={24} />
                </div>
                <h3 className="font-bold text-lg">TaxAI Assistant</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                  I need help with my tax deductions for my home office.
                </div>
                <div className="bg-taxblue-50 p-3 rounded-lg rounded-tr-none ml-auto max-w-xs">
                  I'll help you maximize your home office deduction. Do you use this space exclusively for business?
                </div>
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                  Yes, I have a dedicated room for my freelance design work.
                </div>
                <div className="bg-taxblue-50 p-3 rounded-lg rounded-tr-none ml-auto max-w-xs">
                  Great! You can claim direct expenses like repairs, and a percentage of utilities based on your office's square footage.
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <input
                  type="text"
                  placeholder="Ask me about your taxes..."
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-taxblue-500"
                />
                <Button size="icon" className="ml-2 bg-taxblue-500">
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
