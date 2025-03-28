
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-taxblue-600">Tax<span className="text-taxgreen-500">AI</span></span>
            </a>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-taxblue-500 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-taxblue-500 transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-700 hover:text-taxblue-500 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-700 hover:text-taxblue-500 transition-colors">FAQ</a>
            <Button variant="outline" className="border-taxblue-500 text-taxblue-500 hover:bg-taxblue-50">Log In</Button>
            <Button className="bg-taxblue-500 hover:bg-taxblue-600">Get Started</Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-taxblue-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:bg-taxblue-50 rounded-md">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:bg-taxblue-50 rounded-md">How It Works</a>
            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:bg-taxblue-50 rounded-md">Pricing</a>
            <a href="#faq" className="block px-3 py-2 text-gray-700 hover:bg-taxblue-50 rounded-md">FAQ</a>
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Button variant="outline" className="border-taxblue-500 text-taxblue-500 hover:bg-taxblue-50 w-full">Log In</Button>
              <Button className="bg-taxblue-500 hover:bg-taxblue-600 w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
