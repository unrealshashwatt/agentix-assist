
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-taxblue-500 to-taxgreen-500 text-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Tax Filing?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied users who have transformed their tax experience with TaxAI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-taxblue-600 hover:bg-gray-100">
              Start For Free
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Book a Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/80">
            No credit card required. Free plan available for simple tax returns.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
