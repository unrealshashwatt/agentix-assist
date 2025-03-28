
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, BarChart, BarChart3, ChevronRight, Lightbulb, Link2, PieChart, Target, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Progress } from '@/components/ui/progress';

interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  type: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  potentialReturn: string;
  taxAdvantage: string;
  minInvestment: string;
  recommendationScore: number;
}

const InvestmentRecommendations = () => {
  const [activeTab, setActiveTab] = useState('forYou');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [investmentOptions, setInvestmentOptions] = useState<InvestmentOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('taxai-user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate('/auth');
    }

    // Simulate API call to fetch investment recommendations
    const timer = setTimeout(() => {
      setInvestmentOptions([
        {
          id: 'inv1',
          name: '401(k) Contribution',
          description: 'Maximize your employer-sponsored retirement plan with pre-tax contributions.',
          type: 'retirement',
          riskLevel: 'Medium',
          potentialReturn: '7-10% annually (historical average)',
          taxAdvantage: 'Contributions reduce taxable income; tax-deferred growth',
          minInvestment: 'Varies by employer, typically no minimum',
          recommendationScore: 98,
        },
        {
          id: 'inv2',
          name: 'Traditional IRA',
          description: 'Individual Retirement Account with tax-deductible contributions.',
          type: 'retirement',
          riskLevel: 'Medium',
          potentialReturn: '7-10% annually (historical average)',
          taxAdvantage: 'Tax-deductible contributions; tax-deferred growth',
          minInvestment: 'No minimum, $6,500 annual contribution limit ($7,500 if over 50)',
          recommendationScore: 92,
        },
        {
          id: 'inv3',
          name: 'Municipal Bond Fund',
          description: 'Investment in state and local government bonds with tax-exempt interest.',
          type: 'bonds',
          riskLevel: 'Low',
          potentialReturn: '2-4% annually (tax-free)',
          taxAdvantage: 'Interest exempt from federal taxes; potentially state taxes too',
          minInvestment: 'Typically $1,000-$3,000 minimum',
          recommendationScore: 85,
        },
        {
          id: 'inv4',
          name: 'Health Savings Account (HSA)',
          description: 'Tax-advantaged account for medical expenses if you have a high-deductible health plan.',
          type: 'healthcare',
          riskLevel: 'Low',
          potentialReturn: 'Varies by investment options, typically 1-7%',
          taxAdvantage: 'Triple tax advantage: tax-deductible contributions, tax-free growth, tax-free withdrawals for qualified expenses',
          minInvestment: 'Varies, $3,850 annual contribution limit for individuals',
          recommendationScore: 96,
        },
        {
          id: 'inv5',
          name: '529 College Savings Plan',
          description: 'Tax-advantaged investment account for education expenses.',
          type: 'education',
          riskLevel: 'Medium',
          potentialReturn: '5-8% annually (historical average)',
          taxAdvantage: 'Tax-free growth and withdrawals for qualified education expenses',
          minInvestment: 'Typically $25-$50 minimum',
          recommendationScore: 78,
        },
        {
          id: 'inv6',
          name: 'Real Estate Investment Trust (REIT)',
          description: 'Investment in companies that own, operate, or finance income-producing real estate.',
          type: 'real-estate',
          riskLevel: 'Medium',
          potentialReturn: '8-12% annually (historical average)',
          taxAdvantage: 'Potential for qualified dividend tax rates, depreciation benefits',
          minInvestment: 'Varies, publicly traded REITs available for stock price',
          recommendationScore: 82,
        },
        {
          id: 'inv7',
          name: 'Tax-Managed Index Fund',
          description: 'Index fund designed to minimize taxable distributions.',
          type: 'stocks',
          riskLevel: 'Medium',
          potentialReturn: '7-10% annually (historical average)',
          taxAdvantage: 'Reduced tax drag through strategic selling and holding',
          minInvestment: 'Typically $1,000-$3,000 minimum',
          recommendationScore: 88,
        },
        {
          id: 'inv8',
          name: 'Solar Energy Tax Credit Investment',
          description: 'Investment in solar energy systems for your home or business.',
          type: 'alternative',
          riskLevel: 'High',
          potentialReturn: 'Variable, includes energy savings + 30% federal tax credit',
          taxAdvantage: 'Federal tax credit of 30% of system costs',
          minInvestment: 'Typically $15,000+ for residential systems',
          recommendationScore: 75,
        },
      ]);
      
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const filteredOptions = investmentOptions.filter((option) => {
    if (selectedCategory === 'all') return true;
    return option.type === selectedCategory;
  });
  
  const sortedOptions = [...filteredOptions].sort((a, b) => {
    if (activeTab === 'forYou') {
      return b.recommendationScore - a.recommendationScore;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-taxblue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing your financial profile for the best tax-saving investments...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Investment Recommendations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Tax-efficient investment options personalized to your financial situation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="forYou">Recommended For You</TabsTrigger>
                <TabsTrigger value="allOptions">All Investment Options</TabsTrigger>
              </TabsList>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'all' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Types
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'retirement' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('retirement')}
                  >
                    Retirement
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'healthcare' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('healthcare')}
                  >
                    Healthcare
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'education' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('education')}
                  >
                    Education
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'stocks' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('stocks')}
                  >
                    Stocks
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'bonds' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('bonds')}
                  >
                    Bonds
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'real-estate' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('real-estate')}
                  >
                    Real Estate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={selectedCategory === 'alternative' ? 'bg-taxblue-50 text-taxblue-600 border-taxblue-200' : ''}
                    onClick={() => setSelectedCategory('alternative')}
                  >
                    Alternative
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                {sortedOptions.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No investment options found</h3>
                      <p className="text-gray-500">
                        Try selecting a different category or changing your filter options.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  sortedOptions.map((option) => (
                    <Card key={option.id} className="overflow-hidden">
                      <CardHeader className="pb-3 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg mb-1 flex items-center">
                              {option.name}
                              {activeTab === 'forYou' && option.recommendationScore > 90 && (
                                <span className="ml-2 bg-taxgreen-100 text-taxgreen-700 text-xs px-2 py-0.5 rounded-full">
                                  Top Pick
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription>{option.description}</CardDescription>
                          </div>
                          {activeTab === 'forYou' && (
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-medium text-gray-800 mb-1">AI Match</div>
                              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center relative">
                                <svg className="absolute" width="48" height="48" viewBox="0 0 48 48">
                                  <circle 
                                    cx="24" 
                                    cy="24" 
                                    r="20" 
                                    fill="none" 
                                    stroke="#e5e7eb" 
                                    strokeWidth="4" 
                                  />
                                  <circle 
                                    cx="24" 
                                    cy="24" 
                                    r="20" 
                                    fill="none" 
                                    stroke={
                                      option.recommendationScore > 90 ? "#22c55e" : 
                                      option.recommendationScore > 80 ? "#3b82f6" : 
                                      "#f59e0b"
                                    } 
                                    strokeWidth="4" 
                                    strokeDasharray="126" 
                                    strokeDashoffset={126 - (option.recommendationScore / 100 * 126)} 
                                    strokeLinecap="round" 
                                    transform="rotate(-90 24 24)" 
                                  />
                                </svg>
                                <span className="text-sm font-semibold">{option.recommendationScore}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Investment Type</p>
                            <p className="text-gray-900 capitalize">{option.type.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Risk Level</p>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                option.riskLevel === 'Low' ? 'bg-green-500' :
                                option.riskLevel === 'Medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span>{option.riskLevel}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Potential Return</p>
                            <p className="text-gray-900">{option.potentialReturn}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Minimum Investment</p>
                            <p className="text-gray-900">{option.minInvestment}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500 mb-1">Tax Advantage</p>
                            <p className="text-gray-900">{option.taxAdvantage}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={() => window.open('#', '_blank')}
                          >
                            <Link2 className="mr-1 h-4 w-4" />
                            Learn More
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-taxblue-500 hover:bg-taxblue-600"
                          >
                            Add to Portfolio
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader className="bg-taxgreen-50 border-b border-taxgreen-100">
                <CardTitle className="text-taxgreen-700 flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-taxgreen-600" />
                  Investment Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your tax profile
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Your Potential Tax Savings
                    </h3>
                    <div className="bg-gray-100 rounded-full h-2.5 mb-2">
                      <div className="bg-taxgreen-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Current: $1,850</span>
                      <span className="text-taxgreen-600 font-medium">Potential: $4,200</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Top Recommendations For You
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-taxblue-100 p-2 rounded mr-3">
                          <TrendingUp className="h-4 w-4 text-taxblue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Maximize Retirement Contributions</p>
                          <p className="text-xs text-gray-500 mt-1">You could save up to $2,350 in taxes this year</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-taxgreen-100 p-2 rounded mr-3">
                          <Target className="h-4 w-4 text-taxgreen-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Open an HSA Account</p>
                          <p className="text-xs text-gray-500 mt-1">Triple tax advantage for healthcare expenses</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-taxwarm-100 p-2 rounded mr-3">
                          <BarChart3 className="h-4 w-4 text-taxwarm-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Consider Municipal Bonds</p>
                          <p className="text-xs text-gray-500 mt-1">Tax-exempt interest income</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Your Tax Situation
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">Current Tax Bracket</span>
                          <span className="text-xs font-medium">22%</span>
                        </div>
                        <Progress value={22} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">Retirement Readiness</span>
                          <span className="text-xs font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">Tax Efficiency Score</span>
                          <span className="text-xs font-medium">68%</span>
                        </div>
                        <Progress value={68} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate('/tax-calculator')}
                  >
                    Calculate Your Taxes
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestmentRecommendations;
