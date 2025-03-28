
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, HelpCircle, Mic, MicOff, Play, StopCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, { message: "SSN must be in format XXX-XX-XXXX" }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
  annualIncome: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Please enter a valid amount" }),
  occupation: z.string().min(2, { message: "Occupation must be at least 2 characters" }),
  filingStatus: z.string().min(1, { message: "Please select a filing status" }),
  dependents: z.string().regex(/^\d+$/, { message: "Please enter a valid number" }),
});

type FormData = z.infer<typeof formSchema>;

interface CommandInfo {
  command: string;
  description: string;
  example: string;
}

const VoiceForm = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentFieldName, setCurrentFieldName] = useState<string | null>(null);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [isMicPermissionGranted, setIsMicPermissionGranted] = useState<boolean | null>(null);
  const [supportsSpeechRecognition, setSupportsSpeechRecognition] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      ssn: '',
      dateOfBirth: '',
      annualIncome: '',
      occupation: '',
      filingStatus: '',
      dependents: '',
    },
  });

  // Command examples and descriptions
  const commands: CommandInfo[] = [
    {
      command: "Set [field] to [value]",
      description: "Sets a specific field to the given value",
      example: "Set name to John Smith"
    },
    {
      command: "Fill [field] with [value]",
      description: "Alternative way to fill a field",
      example: "Fill email with john@example.com"
    },
    {
      command: "Enter [value] for [field]",
      description: "Another way to specify field and value",
      example: "Enter 50000 for annual income"
    },
    {
      command: "Clear [field]",
      description: "Clears the specified field",
      example: "Clear email"
    },
    {
      command: "Clear all",
      description: "Resets the entire form",
      example: "Clear all"
    },
    {
      command: "Next field",
      description: "Moves focus to the next field",
      example: "Next field"
    },
    {
      command: "Previous field",
      description: "Moves focus to the previous field",
      example: "Previous field"
    },
    {
      command: "Focus on [field]",
      description: "Jumps to a specific field",
      example: "Focus on date of birth"
    },
    {
      command: "Submit form",
      description: "Submits the completed form",
      example: "Submit form"
    },
    {
      command: "Stop listening",
      description: "Turns off voice recognition",
      example: "Stop listening"
    },
  ];

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupportsSpeechRecognition(false);
      return;
    }

    // Create a speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setTranscript(transcript);
      processTranscript(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setIsMicPermissionGranted(false);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice commands.",
          variant: "destructive",
        });
      }
    };

    // Check microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setIsMicPermissionGranted(true);
      })
      .catch(() => {
        setIsMicPermissionGranted(false);
      });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      // Double-check permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        
        toast({
          title: "Voice commands activated",
          description: "You can now control the form with your voice.",
        });
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsMicPermissionGranted(false);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice commands.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Voice commands deactivated",
        description: "Voice control has been turned off.",
      });
    }
  };

  const processTranscript = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    setIsProcessing(true);

    // Match different command patterns
    const setFieldPattern = /(?:set|fill|enter|put|input)(?:\s+the)?\s+([a-z\s]+)(?:\s+(?:to|with|as|for|value))?\s+([a-z0-9@\s.-]+)/i;
    const enterValuePattern = /(?:enter|put|input|set)\s+([a-z0-9@\s.-]+)\s+(?:for|in|into|as|in the)\s+([a-z\s]+)/i;
    const clearFieldPattern = /clear\s+(?:the\s+)?([a-z\s]+)/i;
    const clearAllPattern = /clear\s+(?:all|everything|form)/i;
    const navigatePattern = /(?:go\s+to|focus\s+(?:on|to)|jump\s+to)\s+(?:the\s+)?([a-z\s]+)/i;
    const nextFieldPattern = /next\s+(?:field|input|box)/i;
    const previousFieldPattern = /(?:previous|prev|last|back)\s+(?:field|input|box)/i;
    const submitFormPattern = /(?:submit|send|complete)\s+(?:the\s+)?(?:form|data)/i;
    const stopListeningPattern = /(?:stop|end|finish|turn\s+off)\s+(?:listening|recording|voice)/i;

    // Process set field commands
    const setFieldMatch = lowerTranscript.match(setFieldPattern);
    if (setFieldMatch) {
      const fieldName = setFieldMatch[1].trim();
      const value = setFieldMatch[2].trim();
      setFieldValue(fieldName, value);
      return;
    }

    // Process enter value for field commands
    const enterValueMatch = lowerTranscript.match(enterValuePattern);
    if (enterValueMatch) {
      const value = enterValueMatch[1].trim();
      const fieldName = enterValueMatch[2].trim();
      setFieldValue(fieldName, value);
      return;
    }

    // Process clear field commands
    const clearFieldMatch = lowerTranscript.match(clearFieldPattern);
    if (clearFieldMatch) {
      const fieldName = clearFieldMatch[1].trim();
      if (fieldName) {
        clearField(fieldName);
      }
      return;
    }

    // Process clear all command
    if (clearAllPattern.test(lowerTranscript)) {
      form.reset();
      toast({
        title: "Form cleared",
        description: "All fields have been reset.",
      });
      return;
    }

    // Process navigate to field commands
    const navigateMatch = lowerTranscript.match(navigatePattern);
    if (navigateMatch) {
      const fieldName = navigateMatch[1].trim();
      focusField(fieldName);
      return;
    }

    // Process next field command
    if (nextFieldPattern.test(lowerTranscript)) {
      navigateToNextField();
      return;
    }

    // Process previous field command
    if (previousFieldPattern.test(lowerTranscript)) {
      navigateToPreviousField();
      return;
    }

    // Process submit form command
    if (submitFormPattern.test(lowerTranscript)) {
      form.handleSubmit(onSubmit)();
      return;
    }

    // Process stop listening command
    if (stopListeningPattern.test(lowerTranscript)) {
      stopListening();
      toast({
        title: "Voice commands deactivated",
        description: "Voice control has been turned off.",
      });
      return;
    }

    setIsProcessing(false);
  };

  const setFieldValue = (fieldName: string, value: string) => {
    // Map spoken field name to form field name
    const fieldMap: Record<string, keyof FormData> = {
      'name': 'fullName',
      'full name': 'fullName',
      'email': 'email',
      'email address': 'email',
      'ssn': 'ssn',
      'social': 'ssn',
      'social security': 'ssn',
      'social security number': 'ssn',
      'date of birth': 'dateOfBirth',
      'birth date': 'dateOfBirth',
      'birthday': 'dateOfBirth',
      'dob': 'dateOfBirth',
      'income': 'annualIncome',
      'annual income': 'annualIncome',
      'yearly income': 'annualIncome',
      'salary': 'annualIncome',
      'occupation': 'occupation',
      'job': 'occupation',
      'profession': 'occupation',
      'filing status': 'filingStatus',
      'status': 'filingStatus',
      'tax status': 'filingStatus',
      'dependents': 'dependents',
      'number of dependents': 'dependents',
      'dependent count': 'dependents',
    };

    const formField = fieldMap[fieldName] || Object.keys(fieldMap).find(key => 
      key.includes(fieldName) || fieldName.includes(key)
    );

    if (!formField) {
      toast({
        title: "Field not recognized",
        description: `Could not find a field matching "${fieldName}"`,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Process special values
    let processedValue = value;

    // Process date of birth - convert spoken format to YYYY-MM-DD
    if (formField === 'dateOfBirth') {
      const datePatterns = [
        // May 15 1980, May 15th 1980
        /(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\d{4})/i,
        // 5/15/1980, 05-15-1980, etc.
        /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/,
        // 1980-05-15 (already in correct format)
        /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/,
      ];

      const monthNameToNumber: Record<string, string> = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12'
      };

      for (const pattern of datePatterns) {
        const match = value.match(pattern);
        if (match) {
          if (pattern === datePatterns[0]) {
            // Handle month name format
            const month = monthNameToNumber[match[0].split(' ')[0].toLowerCase()];
            const day = match[1].padStart(2, '0');
            const year = match[2];
            processedValue = `${year}-${month}-${day}`;
            break;
          } else if (pattern === datePatterns[1]) {
            // Handle MM/DD/YYYY format
            const month = match[1].padStart(2, '0');
            const day = match[2].padStart(2, '0');
            const year = match[3];
            processedValue = `${year}-${month}-${day}`;
            break;
          } else if (pattern === datePatterns[2]) {
            // Already in YYYY-MM-DD format, just ensure proper formatting
            const year = match[1];
            const month = match[2].padStart(2, '0');
            const day = match[3].padStart(2, '0');
            processedValue = `${year}-${month}-${day}`;
            break;
          }
        }
      }
    }

    // Process SSN to ensure format XXX-XX-XXXX
    if (formField === 'ssn') {
      // Remove any non-digits
      const digits = value.replace(/\D/g, '');
      if (digits.length === 9) {
        processedValue = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
      }
    }

    // Process filing status values
    if (formField === 'filingStatus') {
      // Map common spoken filing status terms
      const statusMap: Record<string, string> = {
        'single': 'Single',
        'married': 'Married Filing Jointly',
        'married filing jointly': 'Married Filing Jointly',
        'jointly': 'Married Filing Jointly',
        'married filing separately': 'Married Filing Separately',
        'separately': 'Married Filing Separately',
        'head of household': 'Head of Household',
        'household': 'Head of Household',
        'qualifying widow': 'Qualifying Widow(er)',
        'qualifying widower': 'Qualifying Widow(er)',
        'widow': 'Qualifying Widow(er)',
        'widower': 'Qualifying Widow(er)',
      };

      for (const [key, mappedValue] of Object.entries(statusMap)) {
        if (value.toLowerCase().includes(key)) {
          processedValue = mappedValue;
          break;
        }
      }
    }

    // Clean numbers (income and dependents)
    if (formField === 'annualIncome') {
      // Handle values like "fifty thousand" or "50k"
      const numberWords: Record<string, number> = {
        'thousand': 1000,
        'k': 1000,
        'million': 1000000,
        'mill': 1000000,
        'm': 1000000,
      };

      for (const [word, multiplier] of Object.entries(numberWords)) {
        if (value.toLowerCase().includes(word)) {
          const numericPart = parseFloat(value.toLowerCase().replace(word, '').trim());
          if (!isNaN(numericPart)) {
            processedValue = (numericPart * multiplier).toString();
            break;
          }
        }
      }

      // Remove any currency symbols and commas
      processedValue = processedValue.replace(/[$,]/g, '');
    }

    // Update form field
    form.setValue(formField as keyof FormData, processedValue);
    
    toast({
      title: "Field updated",
      description: `Set ${fieldName} to "${processedValue}"`,
    });
    
    setIsProcessing(false);
  };

  const clearField = (fieldName: string) => {
    // Map spoken field name to form field name (same mapping as in setFieldValue)
    const fieldMap: Record<string, keyof FormData> = {
      'name': 'fullName',
      'full name': 'fullName',
      'email': 'email',
      'email address': 'email',
      'ssn': 'ssn',
      'social': 'ssn',
      'social security': 'ssn',
      'social security number': 'ssn',
      'date of birth': 'dateOfBirth',
      'birth date': 'dateOfBirth',
      'birthday': 'dateOfBirth',
      'dob': 'dateOfBirth',
      'income': 'annualIncome',
      'annual income': 'annualIncome',
      'yearly income': 'annualIncome',
      'salary': 'annualIncome',
      'occupation': 'occupation',
      'job': 'occupation',
      'profession': 'occupation',
      'filing status': 'filingStatus',
      'status': 'filingStatus',
      'tax status': 'filingStatus',
      'dependents': 'dependents',
      'number of dependents': 'dependents',
      'dependent count': 'dependents',
    };

    const formField = fieldMap[fieldName] || Object.keys(fieldMap).find(key => 
      key.includes(fieldName) || fieldName.includes(key)
    );

    if (!formField) {
      toast({
        title: "Field not recognized",
        description: `Could not find a field matching "${fieldName}"`,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Clear the field
    form.setValue(formField as keyof FormData, '');
    
    toast({
      title: "Field cleared",
      description: `Cleared ${fieldName}`,
    });
    
    setIsProcessing(false);
  };

  const focusField = (fieldName: string) => {
    // Map spoken field name to form field (same mapping as in setFieldValue)
    const fieldMap: Record<string, keyof FormData> = {
      'name': 'fullName',
      'full name': 'fullName',
      'email': 'email',
      'email address': 'email',
      'ssn': 'ssn',
      'social': 'ssn',
      'social security': 'ssn',
      'social security number': 'ssn',
      'date of birth': 'dateOfBirth',
      'birth date': 'dateOfBirth',
      'birthday': 'dateOfBirth',
      'dob': 'dateOfBirth',
      'income': 'annualIncome',
      'annual income': 'annualIncome',
      'yearly income': 'annualIncome',
      'salary': 'annualIncome',
      'occupation': 'occupation',
      'job': 'occupation',
      'profession': 'occupation',
      'filing status': 'filingStatus',
      'status': 'filingStatus',
      'tax status': 'filingStatus',
      'dependents': 'dependents',
      'number of dependents': 'dependents',
      'dependent count': 'dependents',
    };

    const formField = fieldMap[fieldName] || Object.keys(fieldMap).find(key => 
      key.includes(fieldName) || fieldName.includes(key)
    );

    if (!formField) {
      toast({
        title: "Field not recognized",
        description: `Could not find a field matching "${fieldName}"`,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Focus on the field
    const fieldElement = document.getElementById(formField as string);
    if (fieldElement) {
      fieldElement.focus();
      setCurrentFieldName(formField as string);
      
      toast({
        title: "Field focused",
        description: `Now focusing on ${fieldName}`,
      });
    }
    
    setIsProcessing(false);
  };

  const navigateToNextField = () => {
    const fieldOrder: (keyof FormData)[] = [
      'fullName', 'email', 'ssn', 'dateOfBirth', 
      'annualIncome', 'occupation', 'filingStatus', 'dependents'
    ];
    
    if (!currentFieldName) {
      // If no field is currently focused, focus the first field
      const fieldElement = document.getElementById(fieldOrder[0] as string);
      if (fieldElement) {
        fieldElement.focus();
        setCurrentFieldName(fieldOrder[0]);
      }
    } else {
      // Find current index and move to next
      const currentIndex = fieldOrder.indexOf(currentFieldName as keyof FormData);
      if (currentIndex < fieldOrder.length - 1) {
        const nextField = fieldOrder[currentIndex + 1];
        const fieldElement = document.getElementById(nextField as string);
        if (fieldElement) {
          fieldElement.focus();
          setCurrentFieldName(nextField);
          
          toast({
            title: "Moved to next field",
            description: `Now focusing on ${nextField.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          });
        }
      } else {
        toast({
          title: "End of form",
          description: "Already at the last field",
        });
      }
    }
    
    setIsProcessing(false);
  };

  const navigateToPreviousField = () => {
    const fieldOrder: (keyof FormData)[] = [
      'fullName', 'email', 'ssn', 'dateOfBirth', 
      'annualIncome', 'occupation', 'filingStatus', 'dependents'
    ];
    
    if (!currentFieldName) {
      // If no field is currently focused, do nothing
      toast({
        title: "No field selected",
        description: "Please select a field first",
      });
    } else {
      // Find current index and move to previous
      const currentIndex = fieldOrder.indexOf(currentFieldName as keyof FormData);
      if (currentIndex > 0) {
        const prevField = fieldOrder[currentIndex - 1];
        const fieldElement = document.getElementById(prevField as string);
        if (fieldElement) {
          fieldElement.focus();
          setCurrentFieldName(prevField);
          
          toast({
            title: "Moved to previous field",
            description: `Now focusing on ${prevField.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          });
        }
      } else {
        toast({
          title: "Beginning of form",
          description: "Already at the first field",
        });
      }
    }
    
    setIsProcessing(false);
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    
    toast({
      title: "Form Submitted",
      description: "Your information has been successfully submitted.",
    });
    
    // Normally, you would send this data to your backend
    // For this demo, we'll just display a success message
    
    // Stop listening after submission
    if (isListening) {
      stopListening();
    }
  };

  // Handle field focus for tracking current field
  const handleFieldFocus = (fieldName: keyof FormData) => {
    setCurrentFieldName(fieldName);
  };

  if (!supportsSpeechRecognition) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Voice-Controlled Form</CardTitle>
                <CardDescription>
                  Your browser doesn't support Speech Recognition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="bg-red-50 p-4 rounded-full inline-flex mx-auto mb-4">
                    <MicOff className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Browser Not Supported</h3>
                  <p className="text-gray-500 mb-4">
                    Unfortunately, your browser doesn't support the Speech Recognition API necessary for voice control.
                  </p>
                  <p className="text-gray-500">
                    Please try using a modern browser like Chrome, Edge, or Safari to access this feature.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Voice-Controlled Tax Form</h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill out your tax information using voice commands for a hands-free experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Tax Information Form</CardTitle>
                <CardDescription>
                  {isListening 
                    ? "Voice control active. Speak your commands to fill the form."
                    : "Click 'Start Voice Control' to begin using voice commands."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                                id="fullName"
                                onFocus={() => handleFieldFocus('fullName')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="youremail@example.com" 
                                type="email" 
                                {...field} 
                                id="email"
                                onFocus={() => handleFieldFocus('email')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="ssn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Security Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="XXX-XX-XXXX" 
                                {...field} 
                                id="ssn"
                                onFocus={() => handleFieldFocus('ssn')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="YYYY-MM-DD" 
                                {...field} 
                                id="dateOfBirth"
                                onFocus={() => handleFieldFocus('dateOfBirth')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="annualIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Income</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                <Input 
                                  placeholder="50000" 
                                  className="pl-7" 
                                  {...field} 
                                  id="annualIncome"
                                  onFocus={() => handleFieldFocus('annualIncome')}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your job title" 
                                {...field} 
                                id="occupation"
                                onFocus={() => handleFieldFocus('occupation')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="filingStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filing Status</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Single, Married Filing Jointly" 
                                {...field} 
                                id="filingStatus"
                                onFocus={() => handleFieldFocus('filingStatus')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dependents"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Dependents</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 2" 
                                {...field} 
                                id="dependents"
                                onFocus={() => handleFieldFocus('dependents')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-taxblue-500 hover:bg-taxblue-600"
                      >
                        Submit Form
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex-1">
                  {isListening && (
                    <div className="text-sm text-gray-500 italic">
                      {isProcessing 
                        ? "Processing your voice command..." 
                        : transcript 
                          ? `Heard: "${transcript}"` 
                          : "Listening for your voice commands..."}
                    </div>
                  )}
                </div>
                <div>
                  {isListening ? (
                    <Button 
                      variant="destructive" 
                      onClick={stopListening}
                      className="flex items-center"
                    >
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop Voice Control
                    </Button>
                  ) : (
                    <Button 
                      className="bg-taxgreen-500 hover:bg-taxgreen-600 flex items-center"
                      onClick={startListening}
                      disabled={isMicPermissionGranted === false}
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Start Voice Control
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="bg-taxblue-50 border-b border-taxblue-100">
                <CardTitle className="flex items-center text-taxblue-700">
                  <HelpCircle className="mr-2 h-5 w-5 text-taxblue-600" />
                  Voice Command Help
                </CardTitle>
                <CardDescription>
                  Examples of voice commands you can use
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Command Examples</h3>
                    <div className="space-y-2">
                      {commands.slice(0, 5).map((cmd, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-3">
                          <p className="text-sm font-medium text-taxblue-600">{cmd.command}</p>
                          <p className="text-xs text-gray-500 mt-1">Example: "{cmd.example}"</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="mt-2 h-auto p-0 text-taxblue-600"
                      onClick={() => setIsExampleModalOpen(true)}
                    >
                      View all commands
                    </Button>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <h3 className="text-sm font-medium text-green-800 flex items-center mb-2">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                      Tips for Better Recognition
                    </h3>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Speak clearly and at a moderate pace</li>
                      <li>• Use the exact field names when referring to fields</li>
                      <li>• Reduce background noise if possible</li>
                      <li>• For dates, use formats like "1980-05-15" or "May 15 1980"</li>
                      <li>• For SSN, say the digits with or without dashes</li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Why Use Voice Control?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-taxblue-100 p-2 rounded-full mr-2 mt-0.5">
                          <svg className="h-3 w-3 text-taxblue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600">Faster than typing, especially for complex information</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-taxblue-100 p-2 rounded-full mr-2 mt-0.5">
                          <svg className="h-3 w-3 text-taxblue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600">Useful for accessibility needs</p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-taxblue-100 p-2 rounded-full mr-2 mt-0.5">
                          <svg className="h-3 w-3 text-taxblue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p className="text-xs text-gray-600">Hands-free operation for multitasking</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Microphone Status</span>
                      {isMicPermissionGranted === null ? (
                        <span className="text-xs text-gray-500">Checking...</span>
                      ) : isMicPermissionGranted ? (
                        <span className="text-xs text-green-600 flex items-center">
                          <div className="bg-green-100 p-1 rounded-full mr-1">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          </div>
                          Microphone Ready
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 flex items-center">
                          <div className="bg-red-100 p-1 rounded-full mr-1">
                            <MicOff className="h-3 w-3 text-red-600" />
                          </div>
                          Permission Needed
                        </span>
                      )}
                    </div>
                    
                    {isListening && (
                      <div className="flex justify-center mt-2">
                        <div className="relative">
                          <div className="animate-ping absolute h-10 w-10 rounded-full bg-taxgreen-400 opacity-20"></div>
                          <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-taxgreen-500">
                            <Mic className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Voice Command Examples Modal */}
        {isExampleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Voice Command Reference</h2>
                  <button 
                    onClick={() => setIsExampleModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Here are all the voice commands you can use to control the form:
                  </p>
                  
                  <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Command Pattern</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {commands.map((cmd, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cmd.command}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cmd.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">"{cmd.example}"</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Special Value Formatting</h3>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• <strong>Dates:</strong> You can say dates like "May 15 1980", "5/15/1980", or "1980-05-15"</li>
                      <li>• <strong>SSN:</strong> Say all 9 digits with or without dashes, e.g., "123-45-6789" or "123456789"</li>
                      <li>• <strong>Money:</strong> Say "50 thousand" or "50k" for $50,000</li>
                      <li>• <strong>Filing Status:</strong> Say "single", "married filing jointly", "head of household", etc.</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      className="bg-taxblue-500 hover:bg-taxblue-600"
                      onClick={() => setIsExampleModalOpen(false)}
                    >
                      Got It
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VoiceForm;
