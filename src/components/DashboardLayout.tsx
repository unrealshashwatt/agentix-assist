
import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  Gamepad2, 
  HelpCircle, 
  Home, 
  Menu, 
  Mic, 
  PieChart, 
  Target, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: typeof Home;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Tax Calculator', href: '/tax-calculator', icon: Calculator },
  { name: 'Investment Recommendations', href: '/investment-recommendations', icon: Target },
  { name: 'Tax Savings Game', href: '/game-savings', icon: Gamepad2 },
  { name: 'Tax Quiz Game', href: '/game-quiz', icon: HelpCircle },
  { name: 'Voice Form', href: '/voice-form', icon: Mic },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="flex items-center justify-center h-12 w-12 bg-taxblue-600 text-white rounded-full shadow-lg"
        >
          {isMobileSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-30 bg-black/50 transition-opacity",
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white transition-transform transform shadow-xl",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <a href="/" className="flex items-center">
            <span className="text-xl font-display font-bold text-taxblue-600">Tax<span className="text-taxgreen-500">AI</span></span>
          </a>
          <button onClick={() => setIsMobileSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <nav className="px-4 pt-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-taxblue-50 text-taxblue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className={cn(
          "flex flex-col flex-grow bg-white border-r border-gray-200 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}>
          <div className={cn("flex items-center h-16 border-b border-gray-200 px-4", isSidebarOpen ? "justify-between" : "justify-center")}>
            {isSidebarOpen ? (
              <>
                <a href="/" className="flex items-center">
                  <span className="text-xl font-display font-bold text-taxblue-600">Tax<span className="text-taxgreen-500">AI</span></span>
                </a>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeft className="h-5 w-5 text-gray-500" />
                </button>
              </>
            ) : (
              <button onClick={() => setIsSidebarOpen(true)}>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
          <nav className="flex-1 pt-4">
            <ul className="px-2 space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center py-2 rounded-md transition-colors",
                        isSidebarOpen ? "px-3" : "justify-center px-3",
                        isActive
                          ? "bg-taxblue-50 text-taxblue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      title={!isSidebarOpen ? item.name : undefined}
                    >
                      <Icon className={cn("h-5 w-5", isSidebarOpen && "mr-3")} />
                      {isSidebarOpen && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 bg-gray-50",
        isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}>
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
