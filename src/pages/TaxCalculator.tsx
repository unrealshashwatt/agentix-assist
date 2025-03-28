
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Calculator, DollarSign, Info, Percent } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  income: z.coerce.number().min(0, { message: 'Income must be a positive number' }),
  filingStatus: z.string().min(1, { message: 'Please select a filing status' }),
  age: z.coerce.number().min(18, { message: 'You must be at least 18 years old' }).max(120, { message: 'Please enter a valid age' }),
  deductions: z.coerce.number().min(0, { message: 'Deductions must be a positive number' }),
  retirementContributions: z.coerce.number().min(0, { message: 'Contributions must be a positive number' }),
  stateOfResidence: z.string().min(1, { message: 'Please select your state of residence' }),
});

type FormData = z.infer<typeof formSchema>;

const states = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  // Add more states as needed
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
];

const TaxCalculator = () => {
  const [activeTab, setActiveTab] = useState('simple');
  const [taxResults, setTaxResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 0,
      filingStatus: 'single',
      age: 30,
      deductions: 12950, // 2023 standard deduction for single
      retirementContributions: 0,
      stateOfResidence: 'CA',
    },
  });

  const calculateTax = (data: FormData) => {
    setIsCalculating(true);
    
    // Simulating API call with timeout
    setTimeout(() => {
      // This is a simplified tax calculation for demonstration purposes
      // A real implementation would use accurate tax brackets and rules
      const taxableIncome = Math.max(0, data.income - data.deductions - data.retirementContributions);
      
      // Federal tax calculation (simplified brackets for 2023)
      let federalTax = 0;
      if (data.filingStatus === 'single') {
        if (taxableIncome <= 11000) {
          federalTax = taxableIncome * 0.10;
        } else if (taxableIncome <= 44725) {
          federalTax = 1100 + (taxableIncome - 11000) * 0.12;
        } else if (taxableIncome <= 95375) {
          federalTax = 5147 + (taxableIncome - 44725) * 0.22;
        } else if (taxableIncome <= 182100) {
          federalTax = 16290 + (taxableIncome - 95375) * 0.24;
        } else if (taxableIncome <= 231250) {
          federalTax = 37104 + (taxableIncome - 182100) * 0.32;
        } else if (taxableIncome <= 578125) {
          federalTax = 52832 + (taxableIncome - 231250) * 0.35;
        } else {
          federalTax = 174238.25 + (taxableIncome - 578125) * 0.37;
        }
      } else if (data.filingStatus === 'married') {
        // Married filing jointly brackets (simplified)
        if (taxableIncome <= 22000) {
          federalTax = taxableIncome * 0.10;
        } else if (taxableIncome <= 89450) {
          federalTax = 2200 + (taxableIncome - 22000) * 0.12;
        } else if (taxableIncome <= 190750) {
          federalTax = 10294 + (taxableIncome - 89450) * 0.22;
        } else {
          federalTax = 32580 + (taxableIncome - 190750) * 0.24;
        }
      }
      
      // Simplified state tax (just for demonstration)
      let stateTaxRate = 0;
      let stateTax = 0;
      
      switch(data.stateOfResidence) {
        case 'CA':
          stateTaxRate = 0.093;
          break;
        case 'NY':
          stateTaxRate = 0.085;
          break;
        case 'TX':
        case 'FL':
        case 'WA':
        case 'AK':
          stateTaxRate = 0; // No state income tax
          break;
        default:
          stateTaxRate = 0.05; // Default state tax rate
      }
      
      stateTax = taxableIncome * stateTaxRate;
      
      // Calculate effective tax rates
      const federalEffectiveRate = (federalTax / data.income) * 100;
      const stateEffectiveRate = (stateTax / data.income) * 100;
      const totalEffectiveRate = ((federalTax + stateTax) / data.income) * 100;
      
      // Set results
      setTaxResults({
        income: data.income,
        taxableIncome,
        federalTax: Math.round(federalTax),
        stateTax: Math.round(stateTax),
        totalTax: Math.round(federalTax + stateTax),
        takeHomePay: Math.round(data.income - federalTax - stateTax),
        federalEffectiveRate: federalEffectiveRate.toFixed(2),
        stateEffectiveRate: stateEffectiveRate.toFixed(2),
        totalEffectiveRate: totalEffectiveRate.toFixed(2),
        marginRate: data.filingStatus === 'single' 
          ? (taxableIncome > 231250 ? 35 : 
             taxableIncome > 182100 ? 32 : 
             taxableIncome > 95375 ? 24 : 
             taxableIncome > 44725 ? 22 : 
             taxableIncome > 11000 ? 12 : 10)
          : (taxableIncome > 190750 ? 24 : 
             taxableIncome > 89450 ? 22 : 
             taxableIncome > 22000 ? 12 : 10),
      });
      
      // Show toast notification
      toast({
        title: "Tax Calculation Complete",
        description: "Your estimated tax liability has been calculated.",
      });
      
      setIsCalculating(false);
    }, 1500); // Simulate API delay
  };

  const onSubmit = (data: FormData) => {
    calculateTax(data);
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tax Calculator</h1>
          <p className="mt-1 text-sm text-gray-600">
            Estimate your tax liability for the current tax year with our AI-powered calculator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="simple">Simple Calculation</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              </TabsList>
              
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Financial Information</CardTitle>
                  <CardDescription>
                    Provide your income and tax situation details to get an accurate tax estimate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="income"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Income</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                  placeholder="Enter your annual income"
                                  type="number"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="filingStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filing Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select filing status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married Filing Jointly</SelectItem>
                                <SelectItem value="head">Head of Household</SelectItem>
                                <SelectItem value="separate">Married Filing Separately</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Age</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your age"
                                  type="number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="stateOfResidence"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State of Residence</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {states.map((state) => (
                                    <SelectItem key={state.value} value={state.value}>
                                      {state.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {activeTab === 'advanced' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="deductions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Total Deductions</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                      <Input
                                        placeholder="Enter total deductions"
                                        type="number"
                                        className="pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="retirementContributions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Retirement Contributions</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                      <Input
                                        placeholder="401k, IRA contributions"
                                        type="number"
                                        className="pl-10"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                              <p className="text-sm text-gray-600">
                                For a more accurate calculation, include all deductions like mortgage interest, 
                                charitable donations, medical expenses, etc. Consider consulting a tax professional 
                                for complex tax situations.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-taxblue-500 hover:bg-taxblue-600"
                        disabled={isCalculating}
                      >
                        {isCalculating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <Calculator className="mr-2 h-4 w-4" />
                            Calculate Taxes
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </Tabs>
          </div>
          
          <div>
            {taxResults ? (
              <Card>
                <CardHeader className="bg-taxblue-50 border-b border-taxblue-100">
                  <CardTitle className="text-taxblue-700 flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-taxblue-600" />
                    Your Tax Estimate
                  </CardTitle>
                  <CardDescription>
                    Based on the information you provided
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-sm font-medium text-gray-500">Annual Income</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${taxResults.income.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-sm font-medium text-gray-500">Taxable Income</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${taxResults.taxableIncome.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Tax Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-taxblue-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Federal Tax</span>
                          </div>
                          <span className="font-medium">${taxResults.federalTax.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-taxgreen-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">State Tax</span>
                          </div>
                          <span className="font-medium">${taxResults.stateTax.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-taxwarm-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium text-gray-900">Total Tax</span>
                          </div>
                          <span className="font-semibold text-gray-900">${taxResults.totalTax.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-6">
                      <p className="text-sm font-medium text-gray-900 mb-2">Take-Home Pay (After Tax)</p>
                      <p className="text-2xl font-bold text-taxgreen-600">
                        ${taxResults.takeHomePay.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Estimated annual amount after taxes</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Tax Rates</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Federal Effective Rate</span>
                          <div className="flex items-center">
                            <Percent className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-medium">{taxResults.federalEffectiveRate}%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">State Effective Rate</span>
                          <div className="flex items-center">
                            <Percent className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-medium">{taxResults.stateEffectiveRate}%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-900">Total Effective Rate</span>
                          <div className="flex items-center">
                            <Percent className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-semibold">{taxResults.totalEffectiveRate}%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Marginal Tax Rate</span>
                          <div className="flex items-center">
                            <Percent className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-medium">{taxResults.marginRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-96">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Calculator className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">No Calculation Yet</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Fill out the form with your income and tax information, then click "Calculate Taxes" to see your tax estimate.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaxCalculator;
