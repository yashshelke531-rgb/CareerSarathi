import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, X, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCareerStore, TestResult } from '@/stores/careerStore';

interface SkillTestQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}

export default function SkillTestPage() {
  const [showTest, setShowTest] = useState(false);
  const [skillTestQuestions, setSkillTestQuestions] = useState<SkillTestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { testResults, setTestResults } = useCareerStore();

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

  const startTest = () => {
    setSkillTestQuestions(generateSkillTestQuestions());
    setShowTest(true);
    setCurrentQuestion(0);
    setTestAnswers({});
    setShowResults(false);
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
      "Environmental Scientist": { name: "Environmental Scientist", categories: ["environment", "research", "analytical"] },
      "Product Manager": { name: "Product Manager", categories: ["business", "communication", "problem-solving"] },
      "UX/UI Designer": { name: "UX/UI Designer", categories: ["creative", "communication", "preference"] },
      "Cloud Architect": { name: "Cloud Architect", categories: ["tech", "problem-solving", "analytical"] },
      "Cybersecurity Specialist": { name: "Cybersecurity Specialist", categories: ["tech", "problem-solving", "security"] },
      "AI/ML Engineer": { name: "AI/ML Engineer", categories: ["tech", "analytical", "research"] },
      "DevOps Engineer": { name: "DevOps Engineer", categories: ["tech", "problem-solving", "teamwork"] },
      "Investment Banker": { name: "Investment Banker", categories: ["finance", "business", "analytical"] },
      "Accountant": { name: "Accountant", categories: ["finance", "analytical", "security"] },
      "Marketing Manager": { name: "Marketing Manager", categories: ["business", "communication", "creative"] },
      "HR Manager": { name: "HR Manager", categories: ["teamwork", "communication", "business"] },
      "Consultant": { name: "Consultant", categories: ["business", "analytical", "communication"] },
      "Entrepreneur": { name: "Entrepreneur", categories: ["business", "problem-solving", "security"] },
      "Nurse": { name: "Nurse", categories: ["healthcare", "teamwork", "communication"] },
      "Pharmacist": { name: "Pharmacist", categories: ["healthcare", "analytical", "communication"] },
      "Therapist": { name: "Therapist", categories: ["healthcare", "communication", "teamwork"] },
      "Researcher": { name: "Researcher", categories: ["research", "analytical", "problem-solving"] },
      "Architect": { name: "Architect", categories: ["creative", "problem-solving", "analytical"] },
      "Civil Engineer": { name: "Civil Engineer", categories: ["analytical", "problem-solving", "teamwork"] },
      "Mechanical Engineer": { name: "Mechanical Engineer", categories: ["analytical", "problem-solving", "tech"] },
      "Electrical Engineer": { name: "Electrical Engineer", categories: ["tech", "analytical", "problem-solving"] },
      "Chemical Engineer": { name: "Chemical Engineer", categories: ["analytical", "research", "problem-solving"] },
      "Journalist": { name: "Journalist", categories: ["communication", "creative", "research"] },
      "Content Writer": { name: "Content Writer", categories: ["creative", "communication", "research"] },
      "Social Media Manager": { name: "Social Media Manager", categories: ["communication", "creative", "business"] },
      "Video Producer": { name: "Video Producer", categories: ["creative", "communication", "preference"] },
      "Graphic Designer": { name: "Graphic Designer", categories: ["creative", "communication", "preference"] },
      "Web Developer": { name: "Web Developer", categories: ["tech", "creative", "problem-solving"] },
      "Mobile App Developer": { name: "Mobile App Developer", categories: ["tech", "problem-solving", "creative"] },
      "Database Administrator": { name: "Database Administrator", categories: ["tech", "analytical", "problem-solving"] },
      "Network Engineer": { name: "Network Engineer", categories: ["tech", "problem-solving", "analytical"] },
      "Systems Administrator": { name: "Systems Administrator", categories: ["tech", "problem-solving", "teamwork"] },
      "Quality Assurance Engineer": { name: "Quality Assurance Engineer", categories: ["tech", "analytical", "problem-solving"] },
      "Business Intelligence Analyst": { name: "Business Intelligence Analyst", categories: ["analytical", "business", "tech"] },
      "Supply Chain Manager": { name: "Supply Chain Manager", categories: ["business", "analytical", "teamwork"] },
      "Operations Manager": { name: "Operations Manager", categories: ["business", "teamwork", "problem-solving"] },
      "Project Manager": { name: "Project Manager", categories: ["business", "communication", "teamwork"] },
      "Sales Manager": { name: "Sales Manager", categories: ["business", "communication", "teamwork"] },
      "Customer Success Manager": { name: "Customer Success Manager", categories: ["communication", "teamwork", "business"] },
      "Legal Advisor": { name: "Legal Advisor", categories: ["analytical", "communication", "research"] },
      "Insurance Agent": { name: "Insurance Agent", categories: ["business", "communication", "finance"] },
      "Real Estate Agent": { name: "Real Estate Agent", categories: ["business", "communication", "teamwork"] },
      "Pilot": { name: "Pilot", categories: ["tech", "problem-solving", "security"] }
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
    // Show all results without limiting to 5
    setTestResults(results);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">
            Career Skill Test
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Discover which careers match your skills and interests with our comprehensive 15-question assessment.
          </p>
        </motion.div>
      </section>

      {/* Test Section */}
      {!showTest && !showResults && (
        <section className="w-full bg-background py-20">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-12 text-center max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                Ready to Discover Your Ideal Career?
              </h2>
              <p className="font-paragraph text-lg text-primary/70 mb-8">
                This 15-question test analyzes your skills, interests, and preferences to recommend careers that align with your strengths. It takes about 5-10 minutes to complete.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary-foreground font-bold text-sm">✓</span>
                  </div>
                  <p className="font-paragraph text-base text-primary/80 text-left">
                    Personalized career recommendations based on your answers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary-foreground font-bold text-sm">✓</span>
                  </div>
                  <p className="font-paragraph text-base text-primary/80 text-left">
                    Match percentages for each recommended career
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary-foreground font-bold text-sm">✓</span>
                  </div>
                  <p className="font-paragraph text-base text-primary/80 text-left">
                    Insights to help you make informed career decisions
                  </p>
                </div>
              </div>
              <button
                onClick={startTest}
                className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Start Test <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Test Modal */}
      {showTest && !showResults && (
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
                onClick={() => setShowTest(false)}
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

      {/* Results Modal */}
      {showTest && showResults && (
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
                onClick={() => setShowTest(false)}
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
              onClick={() => setShowTest(false)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close Results
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Info Section */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-bold text-secondary-foreground">15</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                15 Questions
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Comprehensive assessment covering all key career dimensions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-bold text-secondary-foreground">5-10</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Minutes
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Quick and efficient assessment of your career potential
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl text-center"
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-bold text-secondary-foreground">50+</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Career Matches
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Unlimited career recommendations from 50+ options
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
