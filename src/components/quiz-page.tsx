
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, ArrowLeft, ArrowRight, Bot, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { generateQuiz, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";

const manualQuizzes = [
    {
      id: "quiz1",
      title: "Quantitative Aptitude: Time & Work",
      questions: [
        { id: "q1", question: "A can do a piece of work in 10 days, and B can do it in 15 days. In how many days can they do it working together?", options: ["4 days", "5 days", "6 days", "8 days"], correctAnswer: "6 days" },
        { id: "q2", question: "If 12 men can build a wall in 20 days, how many men can build the same wall in 15 days?", options: ["15 men", "16 men", "18 men", "20 men"], correctAnswer: "16 men" },
        { id: "q3", question: "A and B together can do a piece of work in 8 days. If A alone can do it in 12 days, then in how many days can B alone do it?", options: ["18 days", "20 days", "24 days", "28 days"], correctAnswer: "24 days" },
        { id: "q4", question: "3 men or 4 women can plough a field in 43 days. How long will 7 men and 5 women take to plough it?", options: ["12 days", "15 days", "18 days", "21 days"], correctAnswer: "12 days" },
        { id: "q5", question: "A is twice as good a workman as B and together they finish a piece of work in 14 days. In how many days can A alone finish the work?", options: ["20 days", "21 days", "22 days", "23 days"], correctAnswer: "21 days" },
      ],
    },
    {
        id: "quiz2",
        title: "Reasoning: Blood Relations",
        questions: [
            { id: "q1", question: "Pointing to a woman, a man said, 'Her father is the only son of my father.' How is the man related to the woman?", options: ["Father", "Brother", "Uncle", "Son"], correctAnswer: "Father" },
            { id: "q2", question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?", options: ["Granddaughter", "Daughter", "Grandmother", "Grandfather"], correctAnswer: "Granddaughter" },
            { id: "q3", question: "P is the brother of Q and R. S is R's mother. T is P's father. Which of the following statements cannot be definitely true?", options: ["T is Q's father", "S is P's mother", "P is S's son", "Q is T's son"], correctAnswer: "Q is T's son" },
            { id: "q4", question: "X and Y are brothers. R is the father of Y. S is the brother of T and maternal uncle of X. What is the relation of T to R?", options: ["Wife", "Sister", "Mother", "Brother"], correctAnswer: "Wife" },
            { id: "q5", question: "If 'A + B' means 'A is the father of B' and 'A - B' means 'A is the mother of B', what does 'P - Q + R' mean?", options: ["P is the grandmother of R", "P is the mother of R", "P is the aunt of R", "P is the grandfather of R"], correctAnswer: "P is the grandmother of R" },
        ],
    },
    {
        id: "quiz3",
        title: "General Knowledge: Indian History",
        questions: [
            { id: "q1", question: "Who was the first President of India?", options: ["Jawaharlal Nehru", "Sardar Patel", "Dr. Rajendra Prasad", "Mahatma Gandhi"], correctAnswer: "Dr. Rajendra Prasad" },
            { id: "q2", question: "The Battle of Plassey was fought in?", options: ["1757", "1764", "1857", "1782"], correctAnswer: "1757" },
            { id: "q3", question: "Who founded the Maurya Empire?", options: ["Ashoka", "Bindusara", "Chandragupta Maurya", "Samudragupta"], correctAnswer: "Chandragupta Maurya" },
            { id: "q4", question: "The famous 'Quit India Movement' was launched by Mahatma Gandhi in which year?", options: ["1930", "1942", "1945", "1920"], correctAnswer: "1942" },
            { id: "q5", question: "Who is known as the 'Iron Man of India'?", options: ["Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Lal Bahadur Shastri"], correctAnswer: "Sardar Vallabhbhai Patel" },
        ],
    },
    {
        id: 'quiz4',
        title: 'English: Synonyms & Antonyms',
        questions: [
            { id: 'q1', question: "What is a synonym for 'ephemeral'?", options: ['Eternal', 'Transient', 'Ugly', 'Strong'], correctAnswer: 'Transient' },
            { id: 'q2', question: "What is an antonym for 'benevolent'?", options: ['Kind', 'Generous', 'Malevolent', 'Friendly'], correctAnswer: 'Malevolent' },
            { id: 'q3', question: "Choose the synonym for 'ubiquitous'.", options: ['Rare', 'Scarce', 'Omnipresent', 'Hidden'], correctAnswer: 'Omnipresent' },
            { id: 'q4', question: "Choose the antonym for 'assiduous'.", options: ['Diligent', 'Careful', 'Lazy', 'Hardworking'], correctAnswer: 'Lazy' },
            { id: 'q5', question: "What is a synonym for 'cacophony'?", options: ['Harmony', 'Silence', 'Discord', 'Melody'], correctAnswer: 'Discord' },
        ],
    },
    {
        id: 'quiz5',
        title: 'Quant: Percentages',
        questions: [
            { id: 'q1', question: "What is 25% of 200?", options: ['25', '50', '75', '100'], correctAnswer: '50' },
            { id: 'q2', question: "A man's salary is increased by 10% to Rs 11,000. What was his original salary?", options: ['Rs 10,000', 'Rs 9,900', 'Rs 10,100', 'Rs 9,000'], correctAnswer: 'Rs 10,000' },
            { id: 'q3', question: "If 30% of a number is 150, what is the number?", options: ['300', '450', '500', '600'], correctAnswer: '500' },
            { id: 'q4', question: "An item priced at Rs 80 is sold for Rs 60. What is the discount percentage?", options: ['20%', '25%', '30%', '33.33%'], correctAnswer: '25%' },
            { id: 'q5', question: "What is 0.5% of 1000?", options: ['5', '0.5', '50', '0.05'], correctAnswer: '5' },
        ],
    },
    {
        id: 'quiz6',
        title: 'Reasoning: Analogies',
        questions: [
            { id: 'q1', question: "Doctor is to Patient as Lawyer is to ?", options: ['Client', 'Customer', 'Accused', 'Judge'], correctAnswer: 'Client' },
            { id: 'q2', question: "Dog : Bark :: Goat : ?", options: ['Bleat', 'Howl', 'Grunt', 'Squeak'], correctAnswer: 'Bleat' },
            { id: 'q3', question: "India : Rupee :: Japan : ?", options: ['Yuan', 'Yen', 'Won', 'Dollar'], correctAnswer: 'Yen' },
            { id: 'q4', question: "Moon : Satellite :: Earth : ?", options: ['Sun', 'Planet', 'Solar System', 'Asteroid'], correctAnswer: 'Planet' },
            { id: 'q5', question: "Eye : Myopia :: Teeth : ?", options: ['Pyorrhoea', 'Cataract', 'Trachoma', 'Eczema'], correctAnswer: 'Pyorrhoea' },
        ],
    },
    {
        id: 'quiz7',
        title: 'GK: Indian Geography',
        questions: [
            { id: 'q1', question: "Which is the longest river in India?", options: ['Ganga', 'Brahmaputra', 'Godavari', 'Yamuna'], correctAnswer: 'Ganga' },
            { id: 'q2', question: "What is the capital of India?", options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], correctAnswer: 'New Delhi' },
            { id: 'q3', question: "Which state is known as the 'Spice Garden of India'?", options: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'], correctAnswer: 'Kerala' },
            { id: 'q4', question: "The Kanchenjunga peak is located in which state?", options: ['Sikkim', 'Arunachal Pradesh', 'Himachal Pradesh', 'Uttarakhand'], correctAnswer: 'Sikkim' },
            { id: 'q5', question: "Which is the largest state in India by area?", options: ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'], correctAnswer: 'Rajasthan' },
        ],
    },
    {
        id: 'quiz8',
        title: 'English: Idioms and Phrases',
        questions: [
            { id: 'q1', question: "What is the meaning of 'To bite the dust'?", options: ['To eat dust', 'To fail', 'To be successful', 'To run away'], correctAnswer: 'To fail' },
            { id: 'q2', question: "What does 'A hot potato' mean?", options: ['A delicious dish', 'A controversial issue', 'A very hot object', 'A happy situation'], correctAnswer: 'A controversial issue' },
            { id: 'q3', question: "'Once in a blue moon' means:", options: ['Very often', 'Every month', 'Very rarely', 'Always'], correctAnswer: 'Very rarely' },
            { id: 'q4', question: "What does 'To let the cat out of the bag' mean?", options: ['To buy a cat', 'To reveal a secret', 'To free an animal', 'To start a fight'], correctAnswer: 'To reveal a secret' },
            { id: 'q5', question: "The phrase 'A piece of cake' means:", options: ['Something very easy', 'A tasty dessert', 'A difficult task', 'A small portion'], correctAnswer: 'Something very easy' },
        ],
    },
    {
        id: 'quiz9',
        title: 'Quant: Simple & Compound Interest',
        questions: [
            { id: 'q1', question: "Find the simple interest on Rs. 5000 for 2 years at 5% per annum.", options: ['Rs. 500', 'Rs. 250', 'Rs. 1000', 'Rs. 750'], correctAnswer: 'Rs. 500' },
            { id: 'q2', question: "What is the compound interest on Rs. 1000 for 2 years at 10% per annum?", options: ['Rs. 200', 'Rs. 210', 'Rs. 100', 'Rs. 110'], correctAnswer: 'Rs. 210' },
        ],
    },
    {
        id: 'quiz10',
        title: 'Reasoning: Seating Arrangement',
        questions: [
            { id: 'q1', question: "A, B, C, D, and E are sitting in a circle. C is to the immediate left of A. D is between A and E. Who is to the immediate right of C?", options: ['A', 'B', 'D', 'E'], correctAnswer: 'A' },
            { id: 'q2', question: "Five friends are sitting on a bench. A is to the left of B but on the right of C. D is to the right of B but on the left of E. Who are at the extremes?", options: ['A, E', 'C, E', 'B, D', 'C, D'], correctAnswer: 'C, E' },
        ],
    },
    {
        id: 'quiz11',
        title: 'GK: Indian Polity',
        questions: [
            { id: 'q1', question: "Who is the head of the Indian state?", options: ['President', 'Prime Minister', 'Chief Justice', 'Vice President'], correctAnswer: 'President' },
            { id: 'q2', question: "The Rajya Sabha can have a maximum strength of:", options: ['238', '245', '250', '260'], correctAnswer: '250' },
        ],
    },
    {
        id: 'quiz12',
        title: 'English: Prepositions',
        questions: [
            { id: 'q1', question: "He is good ___ English.", options: ['in', 'at', 'on', 'with'], correctAnswer: 'at' },
            { id: 'q2', question: "I am fond ___ music.", options: ['of', 'for', 'with', 'in'], correctAnswer: 'of' },
        ],
    },
    {
        id: 'quiz13',
        title: 'Quant: Speed, Time & Distance',
        questions: [
            { id: 'q1', question: "A train running at 60 km/h crosses a pole in 9 seconds. What is the length of the train?", options: ['150 meters', '160 meters', '120 meters', '100 meters'], correctAnswer: '150 meters' },
        ],
    },
    {
        id: 'quiz14',
        title: 'Reasoning: Coding-Decoding',
        questions: [
            { id: 'q1', question: "If 'WATER' is coded as 'YCVGT', how is 'HKG' coded?", options: ['JMI', 'IKH', 'ILH', 'JLI'], correctAnswer: 'JMI' },
        ],
    },
    {
        id: 'quiz15',
        title: 'GK: Famous Personalities',
        questions: [
            { id: 'q1', question: "Who wrote the national anthem of India?", options: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Sarojini Naidu', 'Swami Vivekananda'], correctAnswer: 'Rabindranath Tagore' },
        ],
    },
    {
        id: 'quiz16',
        title: 'English: Articles',
        questions: [
            { id: 'q1', question: "I saw ___ unicorn in my dream.", options: ['a', 'an', 'the', 'no article'], correctAnswer: 'a' },
        ],
    },
    {
        id: 'quiz17',
        title: 'Quant: Averages',
        questions: [
            { id: 'q1', question: "The average of first 50 natural numbers is:", options: ['25.5', '25', '26', '25.3'], correctAnswer: '25.5' },
        ],
    },
    {
        id: 'quiz18',
        title: 'Reasoning: Syllogism',
        questions: [
            { id: 'q1', question: "Statements: All pens are pencils. No pencil is a book. Conclusions: I. No pen is a book. II. Some pencils are pens.", options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'], correctAnswer: 'Both follow' },
        ],
    },
].map(quiz => ({ ...quiz, questions: quiz.questions.map(q => ({ ...q, id: Math.random().toString(), question: q.question || "" })) }));


const aiQuickQuizzes = [
    { topic: "General Knowledge Mix", numQuestions: 5 },
    { topic: "Indian Polity", numQuestions: 5 },
    { topic: "Modern Indian History", numQuestions: 5 },
    { topic: "Quantitative Aptitude: Profit & Loss", numQuestions: 5 },
    { topic: "Reasoning: Analogies", numQuestions: 5 },
    { topic: "General Science: Biology", numQuestions: 5 },
    { topic: "Banking Awareness", numQuestions: 5 },
    { topic: "Current Affairs (Last 3 months)", numQuestions: 5 },
    { topic: "Geography: Rivers of India", numQuestions: 5 },
    { topic: "English: Error Spotting", numQuestions: 5 },
    { topic: "Quant: Number Series", numQuestions: 5 },
    { topic: "Reasoning: Direction Sense", numQuestions: 5 },
    { topic: "GK: Books and Authors", numQuestions: 5 },
    { topic: "Computer Knowledge", numQuestions: 5 },
    { topic: "Physics: Units & Measurements", numQuestions: 5 },
    { topic: "Chemistry: Acids & Bases", numQuestions: 5 },
    { topic: "Sports GK", numQuestions: 5 },
    { topic: "Important Dates & Days", numQuestions: 5 },
];


type UserAnswers = { [key: string]: string };

type QuizData = {
    id: string;
    title: string;
    questions: {
        id: string;
        question: string;
        options: string[];
        correctAnswer: string;
    }[];
}

export function QuizPage() {
  const [quizState, setQuizState] = useState<"not-started" | "in-progress" | "finished">("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizData>(manualQuizzes[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [customTopic, setCustomTopic] = useState("Indian History");
  const [customSubTopics, setCustomSubTopics] = useState("");
  const [customNumQuestions, setCustomNumQuestions] = useState(5);
  const [customDifficulty, setCustomDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [customSpecialization, setCustomSpecialization] = useState("");

  const { toast } = useToast();

  const handleStartQuiz = (quizData: QuizData) => {
    setActiveQuiz(quizData);
    setQuizState("in-progress");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(null);
  };

  const handleGenerateAndStartQuiz = async () => {
    setIsGenerating(true);
    try {
        const result = await generateQuiz({ 
            topic: customTopic, 
            subTopics: customSubTopics.split(',').map(s => s.trim()).filter(s => s),
            numQuestions: customNumQuestions,
            difficultyLevel: customDifficulty,
            specialization: customSpecialization || undefined,
        });
        const quizData: QuizData = {
            id: `ai-quiz-${Date.now()}`,
            title: result.title,
            questions: result.questions.map((q, i) => ({...q, id: `q-${i}`})),
        }
        handleStartQuiz(quizData);
    } catch (e) {
        toast({
            variant: "destructive",
            title: "AI Quiz Generation Failed",
            description: "There was an error generating the quiz. Please try again."
        });
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  }
  
  const handleQuickQuiz = async (topic: string, numQuestions: number) => {
    setIsGenerating(true);
    try {
        const result = await generateQuiz({ topic, numQuestions });
        const quizData: QuizData = {
            id: `ai-quiz-${Date.now()}`,
            title: result.title,
            questions: result.questions.map((q, i) => ({...q, id: `q-${i}`})),
        }
        handleStartQuiz(quizData);
    } catch (e) {
        toast({
            variant: "destructive",
            title: "AI Quiz Generation Failed",
            description: "There was an error generating the quiz. Please try again."
        });
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizState("finished");
  };

  if (quizState === "not-started") {
    return (
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Quiz Arena
            </h1>
            <p className="text-muted-foreground">Choose from a topic-wise quiz, or let AI generate one for you!</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Topic-wise Quizzes</CardTitle>
                <CardDescription>Test your knowledge on specific topics with our manually curated quizzes.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {manualQuizzes.map(quiz => (
                    <Button key={quiz.id} variant="outline" className="h-auto py-4" onClick={() => handleStartQuiz(quiz)}>
                        <div className="flex flex-col items-center text-center">
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="text-xs text-muted-foreground">{quiz.questions.length} questions</p>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> AI Quick Quizzes</CardTitle>
                <CardDescription>Let our AI generate a random quiz for you on a popular topic.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aiQuickQuizzes.map(quiz => (
                     <Button key={quiz.topic} variant="secondary" className="h-auto py-4" onClick={() => handleQuickQuiz(quiz.topic, quiz.numQuestions)} disabled={isGenerating}>
                        <div className="flex flex-col items-center text-center">
                            <p className="font-semibold">{quiz.topic}</p>
                            <p className="text-xs text-muted-foreground">{quiz.numQuestions} questions</p>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> Custom AI Quiz</CardTitle>
                <CardDescription>Create your own quiz by specifying a topic and number of questions.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input id="topic" value={customTopic} onChange={(e) => setCustomTopic(e.target.value)} placeholder="e.g. Indian History" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sub-topics">Sub-topics (comma-separated)</Label>
                        <Input id="sub-topics" value={customSubTopics} onChange={(e) => setCustomSubTopics(e.target.value)} placeholder="e.g. Mughal Empire, Indus Valley" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input id="specialization" value={customSpecialization} onChange={(e) => setCustomSpecialization(e.target.value)} placeholder="e.g. Time management, Previous mistakes" />
                    </div>
                </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="num-questions">Number of Questions</Label>
                        <Select value={String(customNumQuestions)} onValueChange={(val) => setCustomNumQuestions(Number(val))}>
                            <SelectTrigger id="num-questions">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(6)].map((_, i) => (
                                    <SelectItem key={i+1} value={String((i+1)*5)}>{(i+1)*5}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select value={customDifficulty} onValueChange={(val: "Easy" | "Medium" | "Hard") => setCustomDifficulty(val)}>
                            <SelectTrigger id="difficulty">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerateAndStartQuiz} disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate & Start Custom Quiz"}
                </Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  if (quizState === "finished") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Quiz Results
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>You scored {score}/{activeQuiz.questions.length}!</CardTitle>
             <CardDescription>
              {score! / activeQuiz.questions.length > 0.7 ? "Great job! You've got a good grasp of the concepts." : "Keep practicing! You'll get there."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {activeQuiz.questions.map((q, index) => (
              <div key={q.id} className="border-l-4 p-4 rounded-r-lg bg-muted/40 data-[correct=true]:border-green-500 data-[correct=false]:border-red-500" data-correct={userAnswers[q.id] === q.correctAnswer}>
                <p className="font-semibold">{index + 1}. {q.question}</p>
                <div className="mt-2 text-sm space-y-1">
                  <p>Your answer: <Badge variant={userAnswers[q.id] === q.correctAnswer ? 'default' : 'destructive'} className={userAnswers[q.id] === q.correctAnswer ? "bg-green-100 text-green-800" : ""}>{userAnswers[q.id] || "Not answered"}</Badge></p>
                  {userAnswers[q.id] !== q.correctAnswer && <p>Correct answer: <Badge variant="secondary">{q.correctAnswer}</Badge></p>}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={() => setQuizState("not-started")} className="w-full">Back to Quiz Arena</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{activeQuiz.title}</CardTitle>
          <CardDescription>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-lg mb-4">{currentQuestion.question}</p>
          <RadioGroup
            value={userAnswers[currentQuestion.id]}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            className="space-y-2"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                <Label htmlFor={`${currentQuestion.id}-${option}`} className="text-base">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
              Submit Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

    
