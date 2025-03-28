
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Coins, DollarSign, Gamepad2, HelpCircle, TrendingUp, Trophy } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface DeductionItem {
  id: string;
  name: string;
  description: string;
  value: number;
  category: string;
  icon: JSX.Element;
}

interface GameState {
  score: number;
  round: number;
  timeLeft: number;
  income: number;
  deductions: string[];
  taxOwed: number;
  taxSavings: number;
  gameOver: boolean;
  highScore: number;
  inProgress: boolean;
}

const TAX_RATE = 0.25; // 25% simplified tax rate
const ROUNDS = 5;
const TIME_PER_ROUND = 30; // seconds

const GameSavings = () => {
  const initialGameState: GameState = {
    score: 0,
    round: 1,
    timeLeft: TIME_PER_ROUND,
    income: 75000,
    deductions: [],
    taxOwed: 0,
    taxSavings: 0,
    gameOver: false,
    highScore: parseInt(localStorage.getItem('taxai-game-highscore') || '0'),
    inProgress: false,
  };
  
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [availableDeductions, setAvailableDeductions] = useState<DeductionItem[]>([]);
  const [selectedDeductions, setSelectedDeductions] = useState<DeductionItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const generateDeductions = (): DeductionItem[] => {
    const deductions: DeductionItem[] = [
      {
        id: 'ded1',
        name: 'Mortgage Interest',
        description: 'Interest paid on home mortgage',
        value: 8000,
        category: 'housing',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
      {
        id: 'ded2',
        name: 'Retirement Contributions',
        description: '401(k) and IRA contributions',
        value: 6000,
        category: 'retirement',
        icon: <TrendingUp className="h-5 w-5" />
      },
      {
        id: 'ded3',
        name: 'Charitable Donations',
        description: 'Donations to qualified organizations',
        value: 2500,
        category: 'charity',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/>
              </svg>
      },
      {
        id: 'ded4',
        name: 'Health Insurance Premiums',
        description: 'Self-employed health insurance deduction',
        value: 4500,
        category: 'health',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 22C6.65685 22 8 20.6569 8 19C8 17.3431 6.65685 16 5 16C3.34315 16 2 17.3431 2 19C2 20.6569 3.34315 22 5 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 16V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
      {
        id: 'ded5',
        name: 'Student Loan Interest',
        description: 'Interest paid on qualified student loans',
        value: 2000,
        category: 'education',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 12V8M12 12H16M12 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
      {
        id: 'ded6',
        name: 'Home Office Deduction',
        description: 'Expenses for using your home for business',
        value: 3000,
        category: 'business',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8V8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 15C10 14.4696 9.78929 13.9609 9.41421 13.5858C9.03914 13.2107 8.53043 13 8 13H7C6.46957 13 5.96086 13.2107 5.58579 13.5858C5.21071 13.9609 5 14.4696 5 15V19H10V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 15C19 14.4696 18.7893 13.9609 18.4142 13.5858C18.0391 13.2107 17.5304 13 17 13H16C15.4696 13 14.9609 13.2107 14.5858 13.5858C14.2107 13.9609 14 14.4696 14 15V19H19V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 5H3V19H21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
      {
        id: 'ded7',
        name: 'Medical Expenses',
        description: 'Qualifying medical and dental expenses',
        value: 5000,
        category: 'health',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6H16M9 12H9.01M15 12H15.01M9 16C9 16.5304 9.21071 17.0391 9.58579 17.4142C9.96086 17.7893 10.4696 18 11 18H12.5C13.0304 18 13.5391 17.7893 13.9142 17.4142C14.2893 17.0391 14.5 16.5304 14.5 16C14.5 15.4696 14.2893 14.9609 13.9142 14.5858C13.5391 14.2107 13.0304 14 12.5 14H11C10.4696 14 9.96086 13.7893 9.58579 13.4142C9.21071 13.0391 9 12.5304 9 12C9 11.4696 9.21071 10.9609 9.58579 10.5858C9.96086 10.2107 10.4696 10 11 10H12.5C13.0304 10 13.5391 9.78929 13.9142 9.41421C14.2893 9.03914 14.5 8.53043 14.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
      {
        id: 'ded8',
        name: 'Child and Dependent Care',
        description: 'Expenses for the care of qualifying dependents',
        value: 3500,
        category: 'family',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
      {
        id: 'ded9',
        name: 'State and Local Taxes',
        description: 'State income tax and property taxes',
        value: 7000,
        category: 'taxes',
        icon: <DollarSign className="h-5 w-5" />
      },
      {
        id: 'ded10',
        name: 'Business Expenses',
        description: 'Qualified business expenses for self-employed',
        value: 4000,
        category: 'business',
        icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
      },
    ];
    
    // For each round, randomly select 6 deductions
    return shuffleArray(deductions).slice(0, 6);
  };
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const startGame = () => {
    // Reset game state
    setGameState({
      ...initialGameState,
      inProgress: true,
      income: 75000 + Math.floor(Math.random() * 50000), // Random income between 75k-125k
    });
    setSelectedDeductions([]);
    setAvailableDeductions(generateDeductions());
    setShowResults(false);
    setIsRevealed(false);
    
    // Start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setGameState(prevState => {
        if (prevState.timeLeft <= 1) {
          // Time's up for this round
          clearInterval(timerRef.current!);
          return {
            ...prevState,
            timeLeft: 0,
          };
        }
        return {
          ...prevState,
          timeLeft: prevState.timeLeft - 1,
        };
      });
    }, 1000);
  };
  
  const selectDeduction = (deduction: DeductionItem) => {
    if (gameState.timeLeft === 0 || selectedDeductions.some(d => d.id === deduction.id)) {
      return;
    }
    
    setSelectedDeductions(prev => [...prev, deduction]);
    setAvailableDeductions(prev => prev.filter(d => d.id !== deduction.id));
  };
  
  const removeDeduction = (deductionId: string) => {
    const deduction = selectedDeductions.find(d => d.id === deductionId);
    if (!deduction) return;
    
    setSelectedDeductions(prev => prev.filter(d => d.id !== deductionId));
    setAvailableDeductions(prev => [...prev, deduction]);
  };
  
  const calculateResults = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const totalDeductions = selectedDeductions.reduce((sum, item) => sum + item.value, 0);
    const taxableIncome = Math.max(0, gameState.income - totalDeductions);
    const taxOwed = taxableIncome * TAX_RATE;
    const taxWithoutDeductions = gameState.income * TAX_RATE;
    const taxSavings = taxWithoutDeductions - taxOwed;
    
    // Award points based on tax savings (1 point per $100 saved)
    const roundScore = Math.floor(taxSavings / 100);
    
    setGameState(prev => {
      const newScore = prev.score + roundScore;
      const newHighScore = Math.max(newScore, prev.highScore);
      
      // Update high score in local storage
      if (newScore > prev.highScore) {
        localStorage.setItem('taxai-game-highscore', newScore.toString());
      }
      
      return {
        ...prev,
        score: newScore,
        taxOwed,
        taxSavings,
        highScore: newHighScore,
        timeLeft: 0,
      };
    });
    
    setShowResults(true);
  };
  
  const nextRound = () => {
    if (gameState.round >= ROUNDS) {
      // Game over
      setGameState(prev => ({
        ...prev,
        gameOver: true,
      }));
      
      toast({
        title: "Game Complete!",
        description: `Your final score: ${gameState.score} points`,
      });
      
      return;
    }
    
    // Setup next round
    setGameState(prev => ({
      ...prev,
      round: prev.round + 1,
      timeLeft: TIME_PER_ROUND,
      income: 75000 + Math.floor(Math.random() * 50000),
    }));
    
    setSelectedDeductions([]);
    setAvailableDeductions(generateDeductions());
    setShowResults(false);
    setIsRevealed(false);
    
    // Restart the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setGameState(prevState => {
        if (prevState.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          return {
            ...prevState,
            timeLeft: 0,
          };
        }
        return {
          ...prevState,
          timeLeft: prevState.timeLeft - 1,
        };
      });
    }, 1000);
  };
  
  const revealOptimal = () => {
    setIsRevealed(true);
    
    // Sort deductions by value (highest first) to show the optimal choices
    const optimal = [...availableDeductions, ...selectedDeductions]
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
    
    setSelectedDeductions(optimal);
    setAvailableDeductions([...availableDeductions, ...selectedDeductions].filter(
      d => !optimal.some(o => o.id === d.id)
    ));
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Gamepad2 className="mr-2 h-6 w-6 text-taxwarm-500" />
              Tax Savings Challenge
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Select the best tax deductions to maximize your savings!
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => setShowRules(true)}
            >
              <HelpCircle className="mr-1 h-4 w-4" />
              How to Play
            </Button>
            
            {!gameState.inProgress ? (
              <Button 
                className="bg-taxwarm-500 hover:bg-taxwarm-600"
                onClick={startGame}
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Start Game
              </Button>
            ) : (
              <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-md">
                <Trophy className="h-4 w-4 text-taxwarm-500" />
                <span className="font-semibold">{gameState.score}</span>
                <span className="text-xs text-gray-500 ml-1">points</span>
              </div>
            )}
          </div>
        </div>
        
        {showRules && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How to Play the Tax Savings Challenge</CardTitle>
              <CardDescription>
                Test your knowledge of tax deductions and maximize your savings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Game Objective</h3>
                <p className="text-gray-600 text-sm">
                  Your goal is to select the tax deductions that will save you the most money. 
                  Each deduction reduces your taxable income, and you want to minimize the amount of tax you owe.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">How Scoring Works</h3>
                <p className="text-gray-600 text-sm">
                  You earn 1 point for every $100 in tax savings. The bigger the deductions you select, the more tax you save,
                  and the higher your score. But choose carefully - you can only select a limited number of deductions each round!
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Game Rules</h3>
                <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                  <li>You have {TIME_PER_ROUND} seconds per round to make your selections</li>
                  <li>Each round presents you with a different annual income and available deductions</li>
                  <li>You can select up to 4 deductions per round</li>
                  <li>The game consists of {ROUNDS} rounds</li>
                  <li>Your final score is the sum of all round scores</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Tips</h3>
                <p className="text-gray-600 text-sm">
                  In general, larger deductions save more on taxes, but sometimes combinations of smaller deductions 
                  can be more beneficial. Use your knowledge of tax rules to maximize your savings!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-taxwarm-500 hover:bg-taxwarm-600"
                onClick={() => setShowRules(false)}
              >
                Got It
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {gameState.inProgress && !gameState.gameOver && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Round {gameState.round} of {ROUNDS}</CardTitle>
                      <CardDescription>
                        Select up to 4 tax deductions that will save you the most money
                      </CardDescription>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold text-xl ${gameState.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                        {gameState.timeLeft}
                      </div>
                      <div className="text-xs text-gray-500">seconds left</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Your Annual Income</div>
                          <div className="text-2xl font-bold text-gray-900">${gameState.income.toLocaleString()}</div>
                        </div>
                        
                        <div className="mt-3 sm:mt-0">
                          <div className="text-sm font-medium text-gray-500">Tax Rate</div>
                          <div className="text-2xl font-bold text-gray-900">{TAX_RATE * 100}%</div>
                        </div>
                        
                        <div className="mt-3 sm:mt-0">
                          <div className="text-sm font-medium text-gray-500">Without Deductions</div>
                          <div className="text-2xl font-bold text-red-600">
                            ${Math.round(gameState.income * TAX_RATE).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {showResults ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-center text-gray-900">Round Results</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-sm font-medium text-gray-500">Total Deductions</div>
                          <div className="text-2xl font-bold text-taxblue-600">
                            ${selectedDeductions.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-sm font-medium text-gray-500">Tax You Owe</div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${Math.round(gameState.taxOwed).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                          <div className="text-sm font-medium text-gray-500">Tax Savings</div>
                          <div className="text-2xl font-bold text-taxgreen-600">
                            ${Math.round(gameState.taxSavings).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-taxwarm-50 p-4 rounded-lg border border-taxwarm-200 text-center">
                        <div className="text-sm font-medium text-taxwarm-700">Points Earned This Round</div>
                        <div className="text-3xl font-bold text-taxwarm-600">
                          +{Math.floor(gameState.taxSavings / 100)}
                        </div>
                        <div className="text-xs text-taxwarm-600 mt-1">
                          1 point for every $100 in tax savings
                        </div>
                      </div>
                      
                      {isRevealed && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-blue-700 mb-2">Optimal Strategy</h4>
                          <p className="text-sm text-blue-600 mb-3">
                            The best strategy was to select the deductions with the highest values.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[...availableDeductions, ...selectedDeductions]
                              .sort((a, b) => b.value - a.value)
                              .slice(0, 4)
                              .map(deduction => (
                                <div key={deduction.id} className="flex items-center">
                                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                                    <Check className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="text-sm">{deduction.name}: ${deduction.value.toLocaleString()}</div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {!isRevealed && (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={revealOptimal}
                          >
                            Show Best Strategy
                          </Button>
                        )}
                        
                        <Button 
                          className="flex-1 bg-taxwarm-500 hover:bg-taxwarm-600"
                          onClick={nextRound}
                        >
                          {gameState.round >= ROUNDS ? 'See Final Results' : 'Next Round'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-3">Your Selected Deductions</h3>
                        {selectedDeductions.length === 0 ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                            <p className="text-gray-500">No deductions selected yet</p>
                            <p className="text-xs text-gray-400 mt-1">Select up to 4 deductions from below</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedDeductions.map(deduction => (
                              <div 
                                key={deduction.id}
                                className="flex justify-between items-center p-3 bg-taxblue-50 border border-taxblue-100 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <div className="bg-taxblue-100 p-2 rounded-md text-taxblue-600 mr-3">
                                    {deduction.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{deduction.name}</div>
                                    <div className="text-sm text-gray-500">${deduction.value.toLocaleString()}</div>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500"
                                  onClick={() => removeDeduction(deduction.id)}
                                >
                                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-gray-900">Available Deductions</h3>
                          <div className="text-sm text-gray-500">
                            Selected: {selectedDeductions.length}/4
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableDeductions.map(deduction => (
                            <div 
                              key={deduction.id}
                              className={`flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${selectedDeductions.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => selectedDeductions.length < 4 && selectDeduction(deduction)}
                            >
                              <div className="flex items-center">
                                <div className="bg-gray-100 p-2 rounded-md text-gray-600 mr-3">
                                  {deduction.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{deduction.name}</div>
                                  <div className="text-sm text-gray-500">${deduction.value.toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-300">
                                <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-taxwarm-500 hover:bg-taxwarm-600"
                          disabled={selectedDeductions.length === 0 || gameState.timeLeft === 0}
                          onClick={calculateResults}
                        >
                          Submit Selections
                        </Button>
                        
                        {gameState.timeLeft === 0 && (
                          <p className="text-center text-sm text-red-500 mt-2">
                            Time's up! Click "Submit Selections" to see your results.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="bg-taxwarm-50 border-b border-taxwarm-100">
                  <CardTitle className="text-taxwarm-700 flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-taxwarm-600" />
                    Game Stats
                  </CardTitle>
                  <CardDescription>
                    Your progress in the Tax Savings Challenge
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500 mb-1">Current Score</div>
                      <div className="text-3xl font-bold text-taxwarm-500">{gameState.score}</div>
                      <p className="text-xs text-gray-500 mt-1">points</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Round Progress</span>
                        <span className="text-sm text-gray-500">{gameState.round}/{ROUNDS}</span>
                      </div>
                      <Progress value={(gameState.round / ROUNDS) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">High Score</span>
                        <span className="bg-taxwarm-100 text-taxwarm-800 text-xs px-2 py-0.5 rounded-full">
                          {gameState.highScore} points
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                          <div>
                            <span className="text-xs font-medium text-gray-500">Tax Savings This Game</span>
                            <p className="text-lg font-semibold text-taxgreen-600">
                              ${Math.round(gameState.score * 100).toLocaleString()}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <Coins className="h-8 w-8 text-taxwarm-500 mx-auto sm:mx-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Game Rules Reminder</h3>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Select up to 4 deductions each round</li>
                        <li>• Bigger deductions often mean more tax savings</li>
                        <li>• You earn 1 point for every $100 saved in taxes</li>
                        <li>• You have {TIME_PER_ROUND} seconds per round</li>
                        <li>• Complete all {ROUNDS} rounds to finish the game</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {gameState.gameOver && (
          <Card className="max-w-xl mx-auto">
            <CardHeader className="text-center bg-taxwarm-50 border-b border-taxwarm-100">
              <div className="mx-auto bg-white rounded-full p-4 shadow-md mb-4">
                <Trophy className="h-12 w-12 text-taxwarm-500" />
              </div>
              <CardTitle className="text-2xl text-taxwarm-700">Game Complete!</CardTitle>
              <CardDescription>
                You've finished the Tax Savings Challenge
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Your Final Score</p>
                <p className="text-4xl font-bold text-taxwarm-500">{gameState.score}</p>
                <p className="text-sm text-gray-500 mt-1">points</p>
                
                {gameState.score > gameState.highScore / 2 && (
                  <div className="mt-4 bg-taxgreen-50 text-taxgreen-700 text-sm py-2 px-4 rounded-full inline-block">
                    {gameState.score > gameState.highScore ? 'New High Score!' : 'Great Job!'}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Total Tax Savings</p>
                  <p className="text-xl font-semibold text-taxgreen-600">
                    ${Math.round(gameState.score * 100).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Previous High Score</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {gameState.highScore}
                  </p>
                </div>
              </div>
              
              <div className="bg-taxblue-50 p-4 rounded-lg border border-taxblue-100 mb-6">
                <h3 className="font-medium text-taxblue-700 mb-2">What You've Learned</h3>
                <p className="text-sm text-taxblue-600 mb-3">
                  Key tax strategies that can help you in real life:
                </p>
                <ul className="text-sm text-taxblue-600 space-y-2">
                  <li className="flex items-start">
                    <div className="bg-taxblue-100 p-1 rounded-full mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-taxblue-600" />
                    </div>
                    <span>Prioritizing higher-value deductions can significantly reduce your tax liability</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-taxblue-100 p-1 rounded-full mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-taxblue-600" />
                    </div>
                    <span>Retirement contributions offer valuable tax advantages</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-taxblue-100 p-1 rounded-full mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-taxblue-600" />
                    </div>
                    <span>Understanding different deduction categories can help you identify all eligible tax breaks</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  className="flex-1 bg-taxwarm-500 hover:bg-taxwarm-600"
                  onClick={startGame}
                >
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!gameState.inProgress && !showRules && (
          <Card className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 flex items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Tax Savings Challenge
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Put your tax knowledge to the test! Select the best tax deductions to maximize your savings 
                    and learn valuable tax strategies along the way.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="bg-taxwarm-100 p-2 rounded-full mr-3">
                        <Gamepad2 className="h-4 w-4 text-taxwarm-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Fun and Educational</p>
                        <p className="text-sm text-gray-500">Learn real tax strategies while playing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-taxwarm-100 p-2 rounded-full mr-3">
                        <TrendingUp className="h-4 w-4 text-taxwarm-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Track Your Progress</p>
                        <p className="text-sm text-gray-500">Beat your high score and improve your tax knowledge</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-taxwarm-100 p-2 rounded-full mr-3">
                        <Trophy className="h-4 w-4 text-taxwarm-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Earn Points</p>
                        <p className="text-sm text-gray-500">Score more by making smart tax-saving choices</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full sm:w-auto bg-taxwarm-500 hover:bg-taxwarm-600"
                    onClick={startGame}
                  >
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Start the Challenge
                  </Button>
                </div>
              </div>
              
              <div className="bg-taxwarm-50 p-6 flex items-center rounded-r-lg">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-taxwarm-800">High Scores</h3>
                    <div className="bg-taxwarm-100 rounded-full p-1">
                      <Trophy className="h-4 w-4 text-taxwarm-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-taxwarm-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <span className="font-bold text-taxwarm-700">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Your High Score</p>
                          <p className="text-sm text-gray-500">
                            {gameState.highScore > 0 ? `${gameState.highScore} points` : 'No games played yet'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-taxwarm-700">
                        {gameState.highScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-taxwarm-100 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-taxwarm-800 mb-2">Did You Know?</h3>
                    <p className="text-sm text-taxwarm-700">
                      The average taxpayer misses out on $1,246 in tax deductions each year. 
                      Learning about all available deductions can significantly reduce your tax burden.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">Game Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Games Played</p>
                        <p className="text-lg font-bold text-taxwarm-600">
                          {localStorage.getItem('taxai-games-played') || '0'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Best Round</p>
                        <p className="text-lg font-bold text-taxwarm-600">
                          {localStorage.getItem('taxai-best-round') || '0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GameSavings;
