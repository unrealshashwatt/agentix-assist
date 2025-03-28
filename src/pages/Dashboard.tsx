
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Calculator, DollarSign, FileText, HelpCircle, LogOut, PieChart, Target, UserCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

type UserData = {
  name: string;
  email: string;
  taxId: string;
  joinDate: string;
};

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for user data in localStorage
    const storedUser = localStorage.getItem('taxai-user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      // Redirect to login if no user data found
      navigate('/auth');
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('taxai-user');
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-taxblue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null; // Will redirect in the useEffect
  }

  const joinDate = new Date(userData.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {userData.name}! Here's an overview of your tax situation.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 flex items-center" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Your personal and tax identification information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-taxblue-100 p-3 rounded-full">
                    <UserCircle className="h-6 w-6 text-taxblue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{userData.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-taxgreen-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-taxgreen-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax ID</p>
                    <p className="text-gray-900">{userData.taxId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-taxwarm-100 p-3 rounded-full">
                    <HelpCircle className="h-6 w-6 text-taxwarm-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-taxblue-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-taxblue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Joined TaxAI</p>
                    <p className="text-gray-900">{joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tax Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimated Tax</p>
                  <p className="text-2xl font-semibold text-gray-900">$4,280.00</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="inline-block mr-1">↓</span> 12% from last year
                  </p>
                </div>
                <div className="p-2 bg-taxblue-100 rounded-md">
                  <DollarSign className="h-5 w-5 text-taxblue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Potential Deductions</p>
                  <p className="text-2xl font-semibold text-gray-900">$1,850.00</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="inline-block mr-1">↑</span> 8% from last year
                  </p>
                </div>
                <div className="p-2 bg-taxgreen-100 rounded-md">
                  <Target className="h-5 w-5 text-taxgreen-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tax Brackets</p>
                  <p className="text-2xl font-semibold text-gray-900">22%</p>
                  <p className="text-xs text-gray-500 mt-1">Federal Income Tax</p>
                </div>
                <div className="p-2 bg-taxwarm-100 rounded-md">
                  <BarChart3 className="h-5 w-5 text-taxwarm-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Filing Status</p>
                  <p className="text-2xl font-semibold text-gray-900">Single</p>
                  <p className="text-xs text-gray-500 mt-1">For tax year 2023</p>
                </div>
                <div className="p-2 bg-taxblue-100 rounded-md">
                  <FileText className="h-5 w-5 text-taxblue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/tax-calculator')}>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-taxblue-100 p-4 rounded-full mb-4">
                <Calculator className="h-6 w-6 text-taxblue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Calculate Your Taxes</h3>
              <p className="text-sm text-gray-500 mb-4">
                Estimate your tax liability with our AI-powered calculator
              </p>
              <Button variant="outline" className="mt-auto">
                Calculate Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/investment-recommendations')}>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-taxgreen-100 p-4 rounded-full mb-4">
                <PieChart className="h-6 w-6 text-taxgreen-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Investment Recommendations</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get personalized tax-saving investment suggestions
              </p>
              <Button variant="outline" className="mt-auto">
                View Recommendations <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/voice-form')}>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-taxwarm-100 p-4 rounded-full mb-4">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-taxwarm-600"
                >
                  <path 
                    d="M12 16C14.2091 16 16 14.2091 16 12V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V12C8 14.2091 9.79086 16 12 16Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M12 19V22" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M8 22H16" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Voice-Controlled Form</h3>
              <p className="text-sm text-gray-500 mb-4">
                Fill out your tax information using just your voice
              </p>
              <Button variant="outline" className="mt-auto">
                Start Voice Form <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
