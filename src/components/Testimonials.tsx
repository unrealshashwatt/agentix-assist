
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jennifer L.",
    role: "Small Business Owner",
    quote: "TaxAI helped me find deductions I didn't even know existed. The AI assistant answered all my questions instantly, and I ended up with a much larger refund than last year!",
    stars: 5,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "Freelance Designer",
    quote: "Filing taxes used to take me an entire weekend. With TaxAI, I finished in under an hour. The interface is intuitive and the AI guidance is like having a tax professional with you.",
    stars: 5,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Sarah K.",
    role: "Healthcare Professional",
    quote: "As someone with income from multiple sources, my taxes were always complicated. TaxAI simplified everything and walked me through each step. Absolutely worth it!",
    stars: 5,
    image: "/placeholder.svg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 text-lg">
            Thousands of individuals and small businesses trust TaxAI for their tax returns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {Array(testimonial.stars).fill(0).map((_, i) => (
                    <Star key={i} size={18} fill="#FFC533" color="#FFC533" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center py-2 px-4 bg-taxblue-50 rounded-full">
            <span className="text-taxblue-600 font-medium">Trusted by 10,000+ users across the United States</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
