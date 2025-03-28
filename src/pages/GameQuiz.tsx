
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Gamepad2, HelpCircle, Trophy, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  currentQuestionIndex: number;
  score: number;
  answeredQuestions: number[];
  selectedOption: number | null;
  isAnswerRevealed: boolean;
  isGameOver: boolean;
  timeLeft: number;
  totalTime: number;
  highScore: number;
}

const allQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of the following is NOT an eligible expense for the Child and Dependent Care Credit?",
    options: [
      "Summer day camp fees",
      "After-school program costs",
      "Babysitting for a social event",
      "Daycare expenses while you work"
    ],
    correctAnswer: 2,
    explanation: "The Child and Dependent Care Credit only applies to care expenses that allow you to work or look for work. Babysitting for social events or non-work activities doesn't qualify.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "What is the maximum contribution limit for a Traditional or Roth IRA for the 2023 tax year if you're under 50?",
    options: [
      "$5,500",
      "$6,000",
      "$6,500",
      "$7,000"
    ],
    correctAnswer: 2,
    explanation: "For 2023, individuals under 50 can contribute up to $6,500 to Traditional or Roth IRAs. Those 50 and older can contribute an additional $1,000 as a catch-up contribution.",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "Which tax filing status typically results in the lowest tax liability for a married couple?",
    options: [
      "Single",
      "Married Filing Jointly",
      "Married Filing Separately",
      "Head of Household"
    ],
    correctAnswer: 1,
    explanation: "Married Filing Jointly usually results in the lowest tax liability for most married couples because it offers higher standard deductions and more favorable tax brackets than Married Filing Separately.",
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "Which of the following is considered a qualified education expense for the American Opportunity Tax Credit?",
    options: [
      "Room and board",
      "Transportation costs",
      "Course materials and textbooks",
      "Health insurance fees"
    ],
    correctAnswer: 2,
    explanation: "Course materials and textbooks are qualified education expenses for the American Opportunity Tax Credit. Room and board, transportation, and health insurance are not eligible expenses for this credit.",
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "What is the general rule for how long you should keep tax records and supporting documents?",
    options: [
      "1 year",
      "3 years",
      "7 years",
      "Forever"
    ],
    correctAnswer: 1,
    explanation: "The IRS recommends keeping tax records for at least 3 years from the date you filed your original return, which is the period of limitations for audits. However, some documents should be kept longer for specific situations.",
    difficulty: 'easy'
  },
  {
    id: 6,
    question: "Which retirement account allows for tax-free withdrawals in retirement if certain conditions are met?",
    options: [
      "Traditional 401(k)",
      "Traditional IRA",
      "Roth IRA",
      "SEP IRA"
    ],
    correctAnswer: 2,
    explanation: "Roth IRAs allow for tax-free withdrawals in retirement if you're at least 59½ years old and the account has been open for at least 5 years. Traditional retirement accounts are typically taxed when withdrawn.",
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "What is the Medicare surtax rate on net investment income for high-income taxpayers?",
    options: [
      "0.9%",
      "1.45%",
      "2.35%",
      "3.8%"
    ],
    correctAnswer: 3,
    explanation: "The Net Investment Income Tax (NIIT) is a 3.8% Medicare surtax on investment income for taxpayers with modified adjusted gross income above certain thresholds.",
    difficulty: 'hard'
  },
  {
    id: 8,
    question: "Which of these home expenses is generally NOT tax-deductible for most individuals?",
    options: [
      "Mortgage interest",
      "Home office expenses (if self-employed)",
      "Home renovation costs",
      "Property taxes"
    ],
    correctAnswer: 2,
    explanation: "General home renovation costs are not tax-deductible for most individuals. Mortgage interest, property taxes, and home office expenses (for self-employed individuals) may be deductible depending on your situation.",
    difficulty: 'easy'
  },
  {
    id: 9,
    question: "What is the standard mileage rate for business use of a personal vehicle for the 2023 tax year?",
    options: [
      "56 cents per mile",
      "58.5 cents per mile",
      "65.5 cents per mile",
      "67 cents per mile"
    ],
    correctAnswer: 2,
    explanation: "For 2023, the standard mileage rate for business use of a personal vehicle is 65.5 cents per mile, an increase from 2022 due to higher vehicle operating costs.",
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "Which tax concept allows you to defer paying taxes on investment gains by reinvesting proceeds into similar investments?",
    options: [
      "Tax-loss harvesting",
      "Dividend reinvestment",
      "Like-kind exchange",
      "Cost basis adjustment"
    ],
    correctAnswer: 2,
    explanation: "A like-kind exchange (Section 1031 exchange) allows you to defer capital gains taxes by reinvesting proceeds from the sale of business or investment property into similar property. Note that since 2018, this only applies to real estate.",
    difficulty: 'hard'
  },
  {
    id: 11,
    question: "What is the maximum income for a single filer to claim the full Earned Income Tax Credit (EITC) with no qualifying children for 2023?",
    options: [
      "$9,160",
      "$17,640",
      "$46,560",
      "$63,398"
    ],
    correctAnswer: 1,
    explanation: "For 2023, a single filer with no qualifying children must have an income below $17,640 to be eligible for the Earned Income Tax Credit. The maximum amount increases with the number of qualifying children.",
    difficulty: 'medium'
  },
  {
    id: 12,
    question: "What is the tax treatment of long-term capital gains for most taxpayers in the 12% or lower federal income tax bracket?",
    options: [
      "Taxed at ordinary income rates",
      "Taxed at 15%",
      "Taxed at 0%",
      "Not taxable"
    ],
    correctAnswer: 2,
    explanation: "Long-term capital gains are taxed at 0% for taxpayers in the 10% and 12% federal income tax brackets (up to certain income thresholds), 15% for most middle-income earners, and 20% for high-income earners.",
    difficulty: 'medium'
  },
  {
    id: 13,
    question: "Which of the following is NOT a type of flexible spending account (FSA)?",
    options: [
      "Health Care FSA",
      "Dependent Care FSA",
      "Retirement FSA",
      "Limited Purpose FSA"
    ],
    correctAnswer: 2,
    explanation: "There is no such thing as a Retirement FSA. The common types of FSAs are Health Care FSA, Dependent Care FSA, and Limited Purpose FSA (for vision and dental expenses when you also have an HSA).",
    difficulty: 'easy'
  },
  {
    id: 14,
    question: "What is the gift tax exclusion amount per recipient for 2023?",
    options: [
      "$15,000",
      "$16,000",
      "$17,000",
      "$18,000"
    ],
    correctAnswer: 2,
    explanation: "For 2023, you can give up to $17,000 per recipient without having to file a gift tax return or using any of your lifetime gift and estate tax exemption.",
    difficulty: 'medium'
  },
  {
    id: 15,
    question: "What is the 'wash sale' rule in tax law?",
    options: [
      "You cannot claim losses on stocks sold at the end of the year",
      "You cannot claim a loss if you buy the same or similar security within 30 days",
      "You must wait 60 days before reinvesting dividends to avoid taxation",
      "You must pay taxes on all investment sales made within the same calendar year"
    ],
    correctAnswer: 1,
    explanation: "The wash sale rule prevents you from claiming a tax loss if you buy the same or substantially identical security within 30 days before or after selling a security at a loss.",
    difficulty: 'hard'
  },
];

const GameQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    answeredQuestions: [],
    selectedOption: null,
    isAnswerRevealed: false,
    isGameOver: false,
    timeLeft: 0,
    totalTime: 0,
    highScore: parseInt(localStorage.getItem('taxai-quiz-highscore') || '0'),
  });
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Clear any timers when component unmounts
      if (gameState.timeLeft > 0) {
        clearTimeout(timerRef);
      }
    };
  }, []);

  let timerRef: NodeJS.Timeout;

  const filterQuestionsByDifficulty = (questions: QuizQuestion[], difficulty: 'easy' | 'medium' | 'hard' | 'all'): QuizQuestion[] => {
    if (difficulty === 'all') {
      return questions;
    }
    return questions.filter(q => q.difficulty === difficulty);
  };

  const startGame = () => {
    // Filter questions by difficulty and shuffle them
    const filteredQuestions = filterQuestionsByDifficulty(allQuestions, difficultyLevel);
    const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
    
    // Select the first numQuestions
    const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
    
    if (selectedQuestions.length === 0) {
      toast({
        title: "Not enough questions",
        description: "There aren't enough questions for the selected difficulty. Please choose a different difficulty level.",
        variant: "destructive",
      });
      return;
    }
    
    // Set the time based on difficulty
    let timePerQuestion = 30; // seconds
    if (difficultyLevel === 'easy') timePerQuestion = 20;
    if (difficultyLevel === 'medium') timePerQuestion = 30;
    if (difficultyLevel === 'hard') timePerQuestion = 45;
    
    // Total time for the quiz
    const totalTime = timePerQuestion * selectedQuestions.length;
    
    setQuestions(selectedQuestions);
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      answeredQuestions: [],
      selectedOption: null,
      isAnswerRevealed: false,
      isGameOver: false,
      timeLeft: totalTime,
      totalTime: totalTime,
      highScore: parseInt(localStorage.getItem('taxai-quiz-highscore') || '0'),
    });
    setIsGameStarted(true);
    
    // Start the timer
    startTimer();
  };
  
  const startTimer = () => {
    if (gameState.timeLeft > 0) {
      timerRef = setTimeout(() => {
        setGameState(prevState => {
          if (prevState.timeLeft <= 1) {
            // Time's up, game over
            return {
              ...prevState,
              timeLeft: 0,
              isGameOver: true,
            };
          }
          return {
            ...prevState,
            timeLeft: prevState.timeLeft - 1,
          };
        });
        
        startTimer(); // Continue the timer
      }, 1000);
    }
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (gameState.isAnswerRevealed || gameState.selectedOption !== null) return;
    
    setGameState({
      ...gameState,
      selectedOption: optionIndex,
    });
  };
  
  const checkAnswer = () => {
    if (gameState.selectedOption === null) return;
    
    const currentQuestion = questions[gameState.currentQuestionIndex];
    const isCorrect = gameState.selectedOption === currentQuestion.correctAnswer;
    
    // Give 10 points for a correct answer, with bonus points based on difficulty
    let pointsToAdd = 0;
    if (isCorrect) {
      if (currentQuestion.difficulty === 'easy') pointsToAdd = 10;
      else if (currentQuestion.difficulty === 'medium') pointsToAdd = 15;
      else if (currentQuestion.difficulty === 'hard') pointsToAdd = 20;
    }
    
    setGameState({
      ...gameState,
      score: gameState.score + pointsToAdd,
      isAnswerRevealed: true,
      answeredQuestions: [...gameState.answeredQuestions, gameState.currentQuestionIndex],
    });
  };
  
  const nextQuestion = () => {
    if (gameState.currentQuestionIndex >= questions.length - 1) {
      // End of quiz
      endGame();
      return;
    }
    
    setGameState({
      ...gameState,
      currentQuestionIndex: gameState.currentQuestionIndex + 1,
      selectedOption: null,
      isAnswerRevealed: false,
    });
  };
  
  const endGame = () => {
    // Clear timer
    clearTimeout(timerRef);
    
    // Update high score if needed
    const newHighScore = Math.max(gameState.score, gameState.highScore);
    localStorage.setItem('taxai-quiz-highscore', newHighScore.toString());
    
    // Track completed quizzes
    const completedQuizzes = parseInt(localStorage.getItem('taxai-quiz-completed') || '0');
    localStorage.setItem('taxai-quiz-completed', (completedQuizzes + 1).toString());
    
    setGameState({
      ...gameState,
      isGameOver: true,
      highScore: newHighScore,
    });
    
    toast({
      title: "Quiz Complete!",
      description: `Your score: ${gameState.score} points`,
    });
  };
  
  const restartGame = () => {
    // Reset game state and start a new game
    setIsGameStarted(false);
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const currentQuestion = questions[gameState.currentQuestionIndex];
  
  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Gamepad2 className="mr-2 h-6 w-6 text-taxblue-500" />
              Tax Knowledge Quiz
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Test your tax knowledge and learn valuable tax concepts!
            </p>
          </div>
          
          {isGameStarted && !gameState.isGameOver && (
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-gray-700">
                <Trophy className="h-4 w-4 text-taxblue-500" />
                <span className="font-semibold">{gameState.score}</span>
                <span className="text-xs text-gray-500 ml-1">points</span>
              </div>
              
              <div className={`flex items-center space-x-1 ${
                gameState.timeLeft < 30 ? 'text-red-600' : 'text-gray-700'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-semibold">{formatTime(gameState.timeLeft)}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-700">
                <span className="text-xs text-gray-500">Question</span>
                <span className="font-semibold">{gameState.currentQuestionIndex + 1}/{questions.length}</span>
              </div>
            </div>
          )}
        </div>
        
        {!isGameStarted ? (
          <Card className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 flex items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Tax Knowledge Quiz
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Challenge yourself with tax questions, learn valuable concepts, and improve your tax
                    knowledge while having fun!
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="bg-taxblue-100 p-2 rounded-full mr-3">
                        <CheckCircle2 className="h-4 w-4 text-taxblue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Test Your Knowledge</p>
                        <p className="text-sm text-gray-500">Answer questions about tax deductions, credits, and more</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-taxblue-100 p-2 rounded-full mr-3">
                        <HelpCircle className="h-4 w-4 text-taxblue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Learn As You Play</p>
                        <p className="text-sm text-gray-500">Detailed explanations help you understand tax concepts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-taxblue-100 p-2 rounded-full mr-3">
                        <Trophy className="h-4 w-4 text-taxblue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Earn Points</p>
                        <p className="text-sm text-gray-500">Score based on difficulty and correct answers</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty Level
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          value={difficultyLevel}
                          onChange={(e) => setDifficultyLevel(e.target.value as any)}
                        >
                          <option value="all">All Levels</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Questions
                        </label>
                        <select
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          value={numQuestions}
                          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                        >
                          <option value="5">5 Questions</option>
                          <option value="10">10 Questions</option>
                          <option value="15">15 Questions</option>
                        </select>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-taxblue-500 hover:bg-taxblue-600"
                      onClick={startGame}
                    >
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-taxblue-50 p-6 flex items-center rounded-r-lg">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-taxblue-800">Quiz Stats</h3>
                    <div className="bg-taxblue-100 rounded-full p-1">
                      <Trophy className="h-4 w-4 text-taxblue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-taxblue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <span className="font-bold text-taxblue-700">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Your High Score</p>
                          <p className="text-sm text-gray-500">
                            {gameState.highScore > 0 ? `${gameState.highScore} points` : 'No quizzes completed yet'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-taxblue-700">
                        {gameState.highScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-taxblue-100 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-taxblue-800 mb-2">Quiz Benefits</h3>
                    <p className="text-sm text-taxblue-700">
                      The more you understand about taxes, the more you can potentially save. 
                      Studies show that taxpayers with better tax knowledge pay an average of 15-20% less in taxes.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">Your Quiz History</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Quizzes Completed</p>
                        <p className="text-lg font-bold text-taxblue-600">
                          {localStorage.getItem('taxai-quiz-completed') || '0'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Correct Answers</p>
                        <p className="text-lg font-bold text-taxblue-600">
                          {localStorage.getItem('taxai-quiz-correct') || '0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : gameState.isGameOver ? (
          <Card className="max-w-xl mx-auto">
            <CardHeader className="text-center bg-taxblue-50 border-b border-taxblue-100">
              <div className="mx-auto bg-white rounded-full p-4 shadow-md mb-4">
                <Trophy className="h-12 w-12 text-taxblue-500" />
              </div>
              <CardTitle className="text-2xl text-taxblue-700">Quiz Complete!</CardTitle>
              <CardDescription>
                You've finished the Tax Knowledge Quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Your Score</p>
                <p className="text-4xl font-bold text-taxblue-500">{gameState.score}</p>
                <p className="text-sm text-gray-500 mt-1">out of {
                  (() => {
                    let maxScore = 0;
                    questions.forEach(q => {
                      if (q.difficulty === 'easy') maxScore += 10;
                      else if (q.difficulty === 'medium') maxScore += 15;
                      else if (q.difficulty === 'hard') maxScore += 20;
                    });
                    return maxScore;
                  })()
                } possible points</p>
                
                {gameState.score > gameState.highScore / 2 && (
                  <div className="mt-4 bg-taxgreen-50 text-taxgreen-700 text-sm py-2 px-4 rounded-full inline-block">
                    {gameState.score > gameState.highScore ? 'New High Score!' : 'Great Job!'}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Correct Answers</p>
                  <p className="text-xl font-semibold text-taxgreen-600">
                    {gameState.answeredQuestions.filter(idx => 
                      questions[idx].correctAnswer === gameState.selectedOption
                    ).length} 
                    <span className="text-base text-gray-500">/{questions.length}</span>
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatTime(gameState.totalTime - gameState.timeLeft)}
                  </p>
                </div>
              </div>
              
              <div className="bg-taxblue-50 p-4 rounded-lg border border-taxblue-100 mb-6">
                <h3 className="font-medium text-taxblue-700 mb-2">Knowledge Areas to Focus On</h3>
                <p className="text-sm text-taxblue-600 mb-3">
                  Based on your answers, consider learning more about:
                </p>
                <ul className="text-sm text-taxblue-600 space-y-2">
                  <li className="flex items-start">
                    <div className="bg-taxblue-100 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-taxblue-600" />
                    </div>
                    <span>Tax deductions and credits that could save you money</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-taxblue-100 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-taxblue-600" />
                    </div>
                    <span>Retirement account benefits and contribution limits</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-taxblue-100 p-1 rounded-full mr-2 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-taxblue-600" />
                    </div>
                    <span>Strategic tax planning for different filing statuses</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    // View all answers
                  }}
                >
                  Review Answers
                </Button>
                <Button 
                  className="flex-1 bg-taxblue-500 hover:bg-taxblue-600"
                  onClick={restartGame}
                >
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {currentQuestion.difficulty === 'easy' ? 'Easy (10 pts)' : 
                   currentQuestion.difficulty === 'medium' ? 'Medium (15 pts)' : 
                   'Hard (20 pts)'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="h-2 bg-gray-200 rounded-full w-32 sm:w-64">
                  <div 
                    className="h-2 bg-taxblue-500 rounded-full" 
                    style={{ width: `${((gameState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {gameState.currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl leading-tight">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        gameState.selectedOption === index 
                          ? gameState.isAnswerRevealed 
                            ? index === currentQuestion.correctAnswer 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200' 
                            : 'bg-taxblue-50 border-taxblue-200' 
                          : gameState.isAnswerRevealed && index === currentQuestion.correctAnswer 
                            ? 'bg-green-50 border-green-200' 
                            : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-5 w-5 mr-3 rounded-full border ${
                          gameState.selectedOption === index 
                            ? gameState.isAnswerRevealed 
                              ? index === currentQuestion.correctAnswer 
                                ? 'bg-green-500 border-green-500' 
                                : 'bg-red-500 border-red-500' 
                              : 'bg-taxblue-500 border-taxblue-500' 
                            : gameState.isAnswerRevealed && index === currentQuestion.correctAnswer 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300'
                        } flex items-center justify-center`}>
                          {gameState.isAnswerRevealed && (
                            index === currentQuestion.correctAnswer ? (
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            ) : (
                              gameState.selectedOption === index && <XCircle className="h-3 w-3 text-white" />
                            )
                          )}
                        </div>
                        <span className={`${
                          gameState.isAnswerRevealed && index === currentQuestion.correctAnswer 
                            ? 'font-medium text-green-900' 
                            : gameState.isAnswerRevealed && gameState.selectedOption === index 
                              ? 'font-medium text-red-900' 
                              : 'text-gray-800'
                        }`}>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {gameState.isAnswerRevealed && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Explanation</h3>
                        <p className="mt-1 text-sm text-blue-700">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!gameState.isAnswerRevealed ? (
                  <Button 
                    className="w-full bg-taxblue-500 hover:bg-taxblue-600"
                    disabled={gameState.selectedOption === null}
                    onClick={checkAnswer}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-taxblue-500 hover:bg-taxblue-600"
                    onClick={nextQuestion}
                  >
                    Next Question
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span className={`text-sm font-medium ${gameState.timeLeft < 30 ? 'text-red-600' : ''}`}>
                  {formatTime(gameState.timeLeft)} remaining
                </span>
              </div>
              
              <Progress 
                value={(gameState.timeLeft / gameState.totalTime) * 100} 
                className="w-1/2 h-2"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GameQuiz;
