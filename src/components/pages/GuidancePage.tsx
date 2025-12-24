import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Calendar, Brain, CheckCircle, AlertCircle, TrendingUp, DollarSign, GraduationCap, Briefcase, ArrowRight, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserGuidance, PopularCareers, ExamsInformation } from '@/entities';
import { Image } from '@/components/ui/image';

interface SkillTestQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface TestResult {
  careerName: string;
  matchPercentage: number;
  reasoning: string;
}

export default function GuidancePage() {
  const [guidanceItems, setGuidanceItems] = useState<UserGuidance[]>([]);
  const [careers, setCareers] = useState<PopularCareers[]>([]);
  const [exams, setExams] = useState<ExamsInformation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  
  // Initial AI Questions State
  const [showInitialQuestions, setShowInitialQuestions] = useState(true);
  const [initialAnswers, setInitialAnswers] = useState<Record<number, string>>({});
  const [userInterests, setUserInterests] = useState<string[]>([]);
  
  // Skill Test State
  const [showSkillTest, setShowSkillTest] = useState(false);
  const [skillTestQuestions, setSkillTestQuestions] = useState<SkillTestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showTestResults, setShowTestResults] = useState(false);
  
  // Career Comparison State
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [guidanceRes, careersRes, examsRes] = await Promise.all([
      BaseCrudService.getAll<UserGuidance>('userguidance'),
      BaseCrudService.getAll<PopularCareers>('popularcareers'),
      BaseCrudService.getAll<ExamsInformation>('examsinformation')
    ]);
    setGuidanceItems(guidanceRes.items);
    setCareers(careersRes.items);
    setExams(examsRes.items);
    setLoading(false);
  };

  // Initial AI Questions
  const initialQuestions = [
    {
      id: 1,
      question: "What interests you the most?",
      options: ["Technology & Innovation", "Business & Finance", "Healthcare & Science", "Creative & Arts", "Education & Research"]
    },
    {
      id: 2,
      question: "What's your preferred work environment?",
      options: ["Fast-paced & Dynamic", "Structured & Organized", "Collaborative & Team-based", "Independent & Flexible", "Outdoor & Active"]
    },
    {
      id: 3,
      question: "What's your primary career goal?",
      options: ["High Income", "Job Security", "Work-Life Balance", "Social Impact", "Creative Expression"]
    }
  ];

  const handleInitialAnswer = (questionId: number, answer: string) => {
    setInitialAnswers({ ...initialAnswers, [questionId]: answer });
  };

  const submitInitialQuestions = () => {
    const answers = Object.values(initialAnswers);
    if (answers.length === 3) {
      setUserInterests(answers);
      setShowInitialQuestions(false);
    }
  };

  // Skill Test Questions
  const generateSkillTestQuestions = (): SkillTestQuestion[] => {
    const questions: SkillTestQuestion[] = [
      { id: 1, question: "How comfortable are you with coding and programming?", options: ["Very Comfortable", "Somewhat Comfortable", "Not Comfortable"], category: "tech" },
      { id: 2, question: "Do you enjoy working with numbers and data analysis?", options: ["Strongly Agree", "Neutral", "Disagree"], category: "analytical" },
      { id: 3, question: "How good are your communication and presentation skills?", options: ["Excellent", "Good", "Needs Improvement"], category: "communication" },
      { id: 4, question: "Do you prefer working independently or in teams?", options: ["Independent", "Both Equally", "Team-based"], category: "teamwork" },
      { id: 5, question: "How interested are you in healthcare and helping others?", options: ["Very Interested", "Somewhat Interested", "Not Interested"], category: "healthcare" },
      { id: 6, question: "Are you interested in business and entrepreneurship?", options: ["Very Interested", "Somewhat Interested", "Not Interested"], category: "business" },
      { id: 7, question: "How creative and artistic are you?", options: ["Very Creative", "Somewhat Creative", "Not Creative"], category: "creative" },
      { id: 8, question: "Do you enjoy research and scientific inquiry?", options: ["Strongly Agree", "Neutral", "Disagree"], category: "research" },
      { id: 9, question: "How important is job security to you?", options: ["Very Important", "Somewhat Important", "Not Important"], category: "security" },
      { id: 10, question: "Are you interested in finance and investment?", options: ["Very Interested", "Somewhat Interested", "Not Interested"], category: "finance" },
      { id: 11, question: "Do you enjoy teaching and mentoring others?", options: ["Very Much", "Sometimes", "Not Really"], category: "teaching" },
      { id: 12, question: "How interested are you in environmental and sustainability issues?", options: ["Very Interested", "Somewhat Interested", "Not Interested"], category: "environment" },
      { id: 13, question: "Are you good at problem-solving and critical thinking?", options: ["Excellent", "Good", "Needs Improvement"], category: "problem-solving" },
      { id: 14, question: "Do you prefer working with people or with technology?", options: ["People", "Both", "Technology"], category: "preference" },
      { id: 15, question: "How important is salary growth in your career choice?", options: ["Very Important", "Somewhat Important", "Not Important"], category: "salary" }
    ];
    return questions;
  };

  const startSkillTest = () => {
    setSkillTestQuestions(generateSkillTestQuestions());
    setShowSkillTest(true);
    setCurrentQuestion(0);
    setTestAnswers({});
    setShowTestResults(false);
  };

  const handleTestAnswer = (answer: string) => {
    setTestAnswers({ ...testAnswers, [currentQuestion]: answer });
    if (currentQuestion < skillTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateTestResults();
    }
  };

  const calculateTestResults = () => {
    const categoryScores: Record<string, number> = {};
    
    skillTestQuestions.forEach((q, idx) => {
      const answer = testAnswers[idx];
      if (!categoryScores[q.category]) categoryScores[q.category] = 0;
      
      if (answer === "Very Comfortable" || answer === "Strongly Agree" || answer === "Excellent" || answer === "Very Interested" || answer === "Very Much" || answer === "Very Important") {
        categoryScores[q.category] += 3;
      } else if (answer === "Somewhat Comfortable" || answer === "Neutral" || answer === "Good" || answer === "Somewhat Interested" || answer === "Sometimes" || answer === "Somewhat Important") {
        categoryScores[q.category] += 2;
      } else {
        categoryScores[q.category] += 1;
      }
    });

    const results: TestResult[] = [];
    const careerMappings: Record<string, { name: string; categories: string[] }> = {
      "Software Engineer": { name: "Software Engineer", categories: ["tech", "problem-solving", "analytical"] },
      "Data Scientist": { name: "Data Scientist", categories: ["analytical", "tech", "research"] },
      "Business Analyst": { name: "Business Analyst", categories: ["business", "analytical", "communication"] },
      "Healthcare Professional": { name: "Healthcare Professional", categories: ["healthcare", "communication", "teamwork"] },
      "Creative Designer": { name: "Creative Designer", categories: ["creative", "communication", "preference"] },
      "Finance Manager": { name: "Finance Manager", categories: ["finance", "analytical", "business"] },
      "Teacher/Educator": { name: "Teacher/Educator", categories: ["teaching", "communication", "teamwork"] },
      "Environmental Scientist": { name: "Environmental Scientist", categories: ["environment", "research", "analytical"] }
    };

    Object.entries(careerMappings).forEach(([_, career]) => {
      const relevantScores = career.categories.map(cat => categoryScores[cat] || 0);
      const avgScore = relevantScores.reduce((a, b) => a + b, 0) / relevantScores.length;
      const matchPercentage = Math.round((avgScore / 3) * 100);
      
      results.push({
        careerName: career.name,
        matchPercentage: Math.max(40, matchPercentage),
        reasoning: `Strong alignment with your ${career.categories.join(", ")} skills and interests.`
      });
    });

    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setTestResults(results.slice(0, 5));
    setShowTestResults(true);
  };

  const toggleCareerSelection = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(selectedCareers.filter(id => id !== careerId));
    } else if (selectedCareers.length < 3) {
      setSelectedCareers([...selectedCareers, careerId]);
    }
  };

  const getSelectedCareerData = () => {
    return careers.filter(career => selectedCareers.includes(career._id));
  };

  const categories = ['All', ...Array.from(new Set(guidanceItems.map(item => item.category).filter(Boolean)))];

  const filteredItems = selectedCategory === 'All'
    ? guidanceItems
    : guidanceItems.filter(item => item.category === selectedCategory);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
      <Header />

      {/* Initial AI Questions Modal */}
      {showInitialQuestions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Let's Get to Know You
              </h2>
              <button
                onClick={() => setShowInitialQuestions(false)}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="font-paragraph text-base text-primary/70 mb-8">
              Answer these 3 quick questions to help us understand your interests and provide better guidance.
            </p>

            <div className="space-y-8">
              {initialQuestions.map((q) => (
                <div key={q.id}>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-4">
                    {q.id}. {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-background transition-colors">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={initialAnswers[q.id] === option}
                          onChange={(e) => handleInitialAnswer(q.id, e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-paragraph text-base text-primary">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowInitialQuestions(false)}
                className="flex-1 px-6 py-3 bg-primary/10 text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={submitInitialQuestions}
                disabled={Object.keys(initialAnswers).length < 3}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">
            Career Guidance Resources
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Comprehensive guides, tutorials, and insights to help you navigate your career journey with confidence.
          </p>
        </motion.div>
      </section>

      {/* Skill Test & Career Comparison Section */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Test Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                    Skill Test
                  </h3>
                  <p className="font-paragraph text-base text-primary/70">
                    Take a 15-question test to discover careers that match your skills and interests.
                  </p>
                </div>
              </div>
              <button
                onClick={startSkillTest}
                className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start Test
              </button>
            </motion.div>

            {/* Career Comparison Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                    Compare Careers
                  </h3>
                  <p className="font-paragraph text-base text-primary/70">
                    Select up to 3 careers to compare salaries, skills, and growth opportunities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="w-full mt-4 px-6 py-3 bg-secondary text-secondary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
              >
                {showComparison ? 'Hide Comparison' : 'Compare Careers'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skill Test Modal */}
      {showSkillTest && !showTestResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Career Skill Test
              </h2>
              <button
                onClick={() => setShowSkillTest(false)}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {skillTestQuestions.length > 0 && (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-paragraph text-sm text-primary/70">
                      Question {currentQuestion + 1} of {skillTestQuestions.length}
                    </span>
                    <span className="font-paragraph text-sm text-primary/70">
                      {Math.round(((currentQuestion + 1) / skillTestQuestions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestion + 1) / skillTestQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="font-heading text-xl font-semibold text-primary mb-6">
                  {skillTestQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-3 mb-8">
                  {skillTestQuestions[currentQuestion].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleTestAnswer(option)}
                      className="w-full p-4 text-left border-2 border-primary/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all font-paragraph text-base text-primary"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Test Results Modal */}
      {showSkillTest && showTestResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Your Results
              </h2>
              <button
                onClick={() => setShowSkillTest(false)}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="font-paragraph text-base text-primary/70 mb-8">
              Based on your answers, here are the top careers that match your skills and interests:
            </p>

            <div className="space-y-4 mb-8">
              {testResults.map((result, index) => (
                <motion.div
                  key={result.careerName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-heading text-lg font-bold text-primary">
                      {index + 1}. {result.careerName}
                    </h3>
                    <span className="font-heading text-2xl font-bold text-secondary">
                      {result.matchPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2 mb-3">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all"
                      style={{ width: `${result.matchPercentage}%` }}
                    />
                  </div>
                  <p className="font-paragraph text-sm text-primary/70">
                    {result.reasoning}
                  </p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setShowSkillTest(false)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close Results
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Career Comparison Section */}
      {showComparison && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <h2 className="font-heading text-4xl font-bold text-primary mb-8">
              Select Careers to Compare
            </h2>
            <p className="font-paragraph text-base text-primary/70 mb-8">
              Click on careers to select them for comparison (up to 3)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {careers.map((career) => (
                <motion.div
                  key={career._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedCareers.includes(career._id) ? 'ring-4 ring-secondary' : ''
                  }`}
                  onClick={() => toggleCareerSelection(career._id)}
                >
                  {career.careerImage && (
                    <div className="h-40 overflow-hidden">
                      <Image
                        src={career.careerImage}
                        alt={career.careerName || 'Career'}
                        className="w-full h-full object-cover"
                        width={400}
                      />
                    </div>
                  )}
                  <div className="bg-white p-6 hover:shadow-lg transition-shadow">
                    <h3 className="font-heading text-xl font-bold text-primary mb-2">
                      {career.careerName}
                    </h3>
                    <p className="font-paragraph text-sm text-primary/70 mb-4 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary/80 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-paragraph text-sm">
                        {formatCurrency(career.averageSalary)}
                      </span>
                    </div>
                    {selectedCareers.includes(career._id) && (
                      <div className="flex items-center gap-2 text-secondary mt-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-paragraph text-sm font-semibold">Selected</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Comparison Table */}
            {selectedCareers.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white rounded-xl p-8 overflow-x-auto border-2 border-primary/10"
              >
                <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                  Career Comparison
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-primary/20">
                      <th className="text-left p-4 font-heading text-lg font-semibold text-primary">
                        Criteria
                      </th>
                      {getSelectedCareerData().map(career => (
                        <th key={career._id} className="text-left p-4 font-heading text-lg font-semibold text-primary">
                          {career.careerName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-primary/10">
                      <td className="p-4 font-paragraph text-base font-semibold text-primary">
                        Average Salary
                      </td>
                      {getSelectedCareerData().map(career => (
                        <td key={career._id} className="p-4 font-paragraph text-base text-primary/80">
                          {formatCurrency(career.averageSalary)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="p-4 font-paragraph text-base font-semibold text-primary">
                        Required Skills
                      </td>
                      {getSelectedCareerData().map(career => (
                        <td key={career._id} className="p-4 font-paragraph text-sm text-primary/80">
                          {career.requiredSkills}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="p-4 font-paragraph text-base font-semibold text-primary">
                        Education Requirements
                      </td>
                      {getSelectedCareerData().map(career => (
                        <td key={career._id} className="p-4 font-paragraph text-sm text-primary/80">
                          {career.educationalRequirements}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-primary/10">
                      <td className="p-4 font-paragraph text-base font-semibold text-primary">
                        Growth Outlook
                      </td>
                      {getSelectedCareerData().map(career => (
                        <td key={career._id} className="p-4 font-paragraph text-base text-primary/80">
                          {career.growthOutlook}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="w-full bg-background py-8">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-paragraph text-base font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-primary hover:bg-primary/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guidance Items */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-paragraph text-lg text-primary">Loading guidance resources...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-paragraph text-xl text-primary/70">
                No guidance resources found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {item.illustration && (
                    <div className="h-64 overflow-hidden">
                      <Image
                        src={item.illustration}
                        alt={item.title || 'Guidance'}
                        className="w-full h-full object-cover"
                        width={600}
                      />
                    </div>
                  )}
                  <div className="p-8">
                    {item.category && (
                      <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground font-paragraph text-sm font-semibold rounded-full mb-3">
                        {item.category}
                      </span>
                    )}
                    <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                      {item.title}
                    </h2>
                    <p className="font-paragraph text-base text-primary/70 mb-6 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2 text-primary/60">
                        <Calendar className="w-4 h-4" />
                        <span className="font-paragraph text-sm">
                          Updated: {formatDate(item.lastUpdated)}
                        </span>
                      </div>
                      {item.videoTutorialUrl && (
                        <div className="flex items-center gap-2 text-primary/60">
                          <Video className="w-4 h-4" />
                          <span className="font-paragraph text-sm">Video Available</span>
                        </div>
                      )}
                    </div>

                    {item.videoTutorialUrl && (
                      <a
                        href={item.videoTutorialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Video className="w-5 h-5" />
                        Watch Tutorial
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Exams Section */}
      <section className="w-full bg-background py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl font-bold text-primary mb-4">
              Important Exams & Certifications
            </h2>
            <p className="font-paragraph text-lg text-primary/70 max-w-3xl mx-auto">
              Stay informed about key entrance exams and certification tests for your career path.
            </p>
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-paragraph text-lg text-primary/70">
                No exams information available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam, index) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    {exam.examLogo && (
                      <div className="flex-shrink-0">
                        <Image
                          src={exam.examLogo}
                          alt={exam.examName || 'Exam'}
                          className="w-20 h-20 object-contain"
                          width={80}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                        {exam.examName}
                      </h3>
                      <p className="font-paragraph text-base text-primary/70 mb-4">
                        {exam.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-primary/80">
                          <Calendar className="w-4 h-4" />
                          <span className="font-paragraph text-sm">
                            Exam: {formatDate(exam.examDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-primary/80">
                          <Calendar className="w-4 h-4" />
                          <span className="font-paragraph text-sm">
                            Deadline: {formatDate(exam.applicationDeadline)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-primary/80">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-paragraph text-sm">
                            Fee: {formatCurrency(exam.examFee)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-primary/80">
                          <GraduationCap className="w-4 h-4" />
                          <span className="font-paragraph text-sm">
                            Eligibility Available
                          </span>
                        </div>
                      </div>
                      {exam.eligibilityCriteria && (
                        <div className="bg-background p-3 rounded-lg mb-4">
                          <p className="font-paragraph text-sm text-primary/70">
                            <span className="font-semibold">Eligibility:</span> {exam.eligibilityCriteria}
                          </p>
                        </div>
                      )}
                      {exam.officialWebsite && (
                        <a
                          href={exam.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-paragraph text-base text-primary font-semibold hover:underline"
                        >
                          Visit Official Website <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl font-bold text-primary mb-4">
              Need More Help?
            </h2>
            <p className="font-paragraph text-lg text-primary/70 max-w-3xl mx-auto">
              Our AI Career Mentor is available 24/7 to answer your questions and provide personalized guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                Comprehensive Guides
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Step-by-step resources covering every aspect of career planning and development.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                Video Tutorials
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Visual learning materials to help you understand complex career concepts easily.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                AI-Powered Insights
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Personalized career recommendations based on your skills, interests, and goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
