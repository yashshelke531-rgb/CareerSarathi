import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Brain, TrendingUp, DollarSign, GraduationCap, ArrowRight, X, Search, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserGuidance, ExamsInformation, PopularCareers } from '@/entities';
import { Image } from '@/components/ui/image';
import { careersData } from '@/data/careersData';
import { skillTestQuestions, careerCategoryMapping } from '@/data/skillTestQuestions';

export default function GuidancePage() {
  const [careers, setCareers] = useState<PopularCareers[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<PopularCareers | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  
  // Skill Test States
  const [showSkillTest, setShowSkillTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skillTestAnswers, setSkillTestAnswers] = useState<string[]>([]);
  const [suggestedCareers, setSuggestedCareers] = useState<PopularCareers[]>([]);
  const [showSkillTestResults, setShowSkillTestResults] = useState(false);
  
  // Career Compare States
  const [showCompare, setShowCompare] = useState(false);
  const [compareSearch1, setCompareSearch1] = useState('');
  const [compareSearch2, setCompareSearch2] = useState('');
  const [selectedCompareCareer1, setSelectedCompareCareer1] = useState<PopularCareers | null>(null);
  const [selectedCompareCareer2, setSelectedCompareCareer2] = useState<PopularCareers | null>(null);
  const [showCompareResults, setShowCompareResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const careersRes = await BaseCrudService.getAll<PopularCareers>('popularcareers');
      setCareers(careersRes.items && careersRes.items.length > 0 ? careersRes.items : careersData as any);
    } catch (error) {
      setCareers(careersData as any);
    }
    setLoading(false);
  };

  const filteredCareers = careers.filter(career =>
    career.careerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCareerClick = (career: PopularCareers) => {
    setSelectedCareer(career);
    setShowCareerModal(true);
  };

  const handleSkillTestAnswer = (categoryIndex: number) => {
    const newAnswers = [...skillTestAnswers];
    newAnswers[currentQuestionIndex] = skillTestQuestions[currentQuestionIndex].options[categoryIndex].careerCategories.join(',');
    setSkillTestAnswers(newAnswers);
    
    if (currentQuestionIndex < skillTestQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateSuggestedCareers(newAnswers);
      setShowSkillTestResults(true);
    }
  };

  const calculateSuggestedCareers = (answers: string[]) => {
    const categoryCount: Record<string, number> = {};
    answers.forEach(answer => {
      const categories = answer.split(',');
      categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const suggestedCareerNames = new Set<string>();
    topCategories.forEach(cat => {
      const careerNames = careerCategoryMapping[cat] || [];
      careerNames.forEach(name => suggestedCareerNames.add(name));
    });

    const suggested = careers.filter(c => suggestedCareerNames.has(c.careerName)).slice(0, 6);
    setSuggestedCareers(suggested);
  };

  const resetSkillTest = () => {
    setShowSkillTest(false);
    setCurrentQuestionIndex(0);
    setSkillTestAnswers([]);
    setSuggestedCareers([]);
    setShowSkillTestResults(false);
  };

  const filteredCompareCareers1 = careers.filter(career =>
    career.careerName?.toLowerCase().includes(compareSearch1.toLowerCase())
  );

  const filteredCompareCareers2 = careers.filter(career =>
    career.careerName?.toLowerCase().includes(compareSearch2.toLowerCase())
  );

  const resetCompare = () => {
    setShowCompare(false);
    setCompareSearch1('');
    setCompareSearch2('');
    setSelectedCompareCareer1(null);
    setSelectedCompareCareer2(null);
    setShowCompareResults(false);
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

      {/* Skill Test Modal */}
      {showSkillTest && !showSkillTestResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Career Interest Test
              </h2>
              <button
                onClick={resetSkillTest}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="font-paragraph text-sm text-primary/70">
                  Question {currentQuestionIndex + 1} of {skillTestQuestions.length}
                </p>
                <div className="w-32 h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / skillTestQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <h3 className="font-heading text-2xl font-bold text-primary mb-6">
              {skillTestQuestions[currentQuestionIndex].question}
            </h3>

            <div className="space-y-3 mb-8">
              {skillTestQuestions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSkillTestAnswer(index)}
                  className="w-full p-4 text-left border-2 border-primary/20 rounded-lg hover:border-secondary hover:bg-background transition-all font-paragraph text-base text-primary"
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetSkillTest}
                className="flex-1 px-6 py-3 bg-primary/10 text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Cancel
              </button>
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  className="flex-1 px-6 py-3 bg-primary/10 text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Skill Test Results Modal */}
      {showSkillTestResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Your Recommended Careers
              </h2>
              <button
                onClick={resetSkillTest}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="font-paragraph text-base text-primary/70 mb-8">
              Based on your answers, here are the careers that match your interests and skills:
            </p>

            {suggestedCareers.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-paragraph text-lg text-primary/70">
                  No careers found matching your profile. Try exploring all careers instead.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {suggestedCareers.map((career, index) => (
                  <motion.div
                    key={career._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedCareer(career);
                      setShowCareerModal(true);
                    }}
                  >
                    <h3 className="font-heading text-xl font-bold text-primary mb-2">
                      {career.careerName}
                    </h3>
                    <p className="font-paragraph text-sm text-primary/70 mb-4 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary/80">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-paragraph text-sm">
                          {formatCurrency(career.averageSalary)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary/80">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-paragraph text-sm">
                          {career.growthOutlook}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={resetSkillTest}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Career Compare Modal */}
      {showCompare && !showCompareResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Compare Careers
              </h2>
              <button
                onClick={resetCompare}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Career 1 Selection */}
              <div>
                <label className="font-heading text-lg font-bold text-primary mb-3 block">
                  Career 1
                </label>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
                  <input
                    type="text"
                    placeholder="Search career..."
                    value={compareSearch1}
                    onChange={(e) => setCompareSearch1(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {selectedCompareCareer1 ? (
                  <div className="bg-background p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-primary">
                          {selectedCompareCareer1.careerName}
                        </h4>
                        <p className="font-paragraph text-sm text-primary/70 mt-1">
                          {formatCurrency(selectedCompareCareer1.averageSalary)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCompareCareer1(null);
                          setCompareSearch1('');
                        }}
                        className="text-primary/60 hover:text-primary"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredCompareCareers1.slice(0, 8).map(career => (
                      <button
                        key={career._id}
                        onClick={() => setSelectedCompareCareer1(career)}
                        className="w-full text-left p-3 border border-primary/20 rounded-lg hover:bg-background transition-colors font-paragraph text-base text-primary"
                      >
                        {career.careerName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Career 2 Selection */}
              <div>
                <label className="font-heading text-lg font-bold text-primary mb-3 block">
                  Career 2
                </label>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
                  <input
                    type="text"
                    placeholder="Search career..."
                    value={compareSearch2}
                    onChange={(e) => setCompareSearch2(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {selectedCompareCareer2 ? (
                  <div className="bg-background p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading text-lg font-bold text-primary">
                          {selectedCompareCareer2.careerName}
                        </h4>
                        <p className="font-paragraph text-sm text-primary/70 mt-1">
                          {formatCurrency(selectedCompareCareer2.averageSalary)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCompareCareer2(null);
                          setCompareSearch2('');
                        }}
                        className="text-primary/60 hover:text-primary"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredCompareCareers2.slice(0, 8).map(career => (
                      <button
                        key={career._id}
                        onClick={() => setSelectedCompareCareer2(career)}
                        className="w-full text-left p-3 border border-primary/20 rounded-lg hover:bg-background transition-colors font-paragraph text-base text-primary"
                      >
                        {career.careerName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetCompare}
                className="flex-1 px-6 py-3 bg-primary/10 text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCompareResults(true)}
                disabled={!selectedCompareCareer1 || !selectedCompareCareer2}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Career Compare Results Modal */}
      {showCompareResults && selectedCompareCareer1 && selectedCompareCareer2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-6xl w-full my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Career Comparison
              </h2>
              <button
                onClick={resetCompare}
                className="text-primary/60 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary/20 sticky top-0 bg-white">
                    <th className="text-left p-4 font-heading text-lg font-semibold text-primary">
                      Criteria
                    </th>
                    <th className="text-left p-4 font-heading text-lg font-semibold text-primary">
                      {selectedCompareCareer1.careerName}
                    </th>
                    <th className="text-left p-4 font-heading text-lg font-semibold text-primary">
                      {selectedCompareCareer2.careerName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Description
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer1.description}
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer2.description}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Average Salary
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {formatCurrency(selectedCompareCareer1.averageSalary)}
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {formatCurrency(selectedCompareCareer2.averageSalary)}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Annual Package
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {formatCurrency(selectedCompareCareer1.annualPackage)}
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {formatCurrency(selectedCompareCareer2.annualPackage)}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Required Skills
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer1.requiredSkills}
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer2.requiredSkills}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Educational Requirements
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer1.educationalRequirements}
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer2.educationalRequirements}
                    </td>
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Growth Outlook
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer1.growthOutlook}
                    </td>
                    <td className="p-4 font-paragraph text-base text-primary/80">
                      {selectedCompareCareer2.growthOutlook}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowCompareResults(false)}
                className="flex-1 px-6 py-3 bg-primary/10 text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Back
              </button>
              <button
                onClick={resetCompare}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Career Detail Modal */}
      {showCareerModal && selectedCareer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full my-8"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-heading text-4xl font-bold text-primary">
                {selectedCareer.careerName}
              </h2>
              <button
                onClick={() => setShowCareerModal(false)}
                className="text-primary/60 hover:text-primary flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background p-6 rounded-lg border-2 border-secondary">
                <DollarSign className="w-6 h-6 text-primary mb-2" />
                <p className="font-paragraph text-sm text-primary/70 mb-1">Average Salary</p>
                <p className="font-heading text-2xl font-bold text-primary">
                  {formatCurrency(selectedCareer.averageSalary)}
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary mb-2" />
                <p className="font-paragraph text-sm text-primary/70 mb-1">Growth Outlook</p>
                <p className="font-heading text-2xl font-bold text-primary">
                  {selectedCareer.growthOutlook}
                </p>
              </div>
              <div className="bg-secondary p-6 rounded-lg">
                <GraduationCap className="w-6 h-6 text-secondary-foreground mb-2" />
                <p className="font-paragraph text-sm text-secondary-foreground/70 mb-1">Education Level</p>
                <p className="font-heading text-lg font-bold text-secondary-foreground">
                  {selectedCareer.educationalRequirements?.split(',')[0] || 'Varies'}
                </p>
              </div>
            </div>

            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
              {/* Overview */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Overview
                </h3>
                <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                  {selectedCareer.description}
                </p>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.requiredSkills?.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground font-paragraph text-sm font-semibold rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Educational Requirements */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Educational Requirements
                </h3>
                <div className="bg-background p-4 rounded-lg">
                  <p className="font-paragraph text-base text-primary/80">
                    {selectedCareer.educationalRequirements}
                  </p>
                </div>
              </div>

              {/* Salary Information */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Salary & Compensation
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="font-paragraph text-sm text-primary/70 mb-1">Average Salary</p>
                    <p className="font-heading text-xl font-bold text-primary">
                      {formatCurrency(selectedCareer.averageSalary)}
                    </p>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <p className="font-paragraph text-sm text-primary/70 mb-1">Annual Package</p>
                    <p className="font-heading text-xl font-bold text-primary">
                      {formatCurrency(selectedCareer.annualPackage)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Career Growth */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Career Growth & Opportunities
                </h3>
                <div className="bg-background p-4 rounded-lg">
                  <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                    This career path shows <span className="font-semibold">{selectedCareer.growthOutlook?.toLowerCase()}</span> growth potential. 
                    With the right skills and experience, professionals in this field can expect competitive compensation and diverse opportunities 
                    across various industries. The demand for skilled professionals in this field continues to grow, making it an excellent choice 
                    for career development.
                  </p>
                </div>
              </div>

              {/* Scope & Potential */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Scope & Potential
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-paragraph font-semibold text-primary">Career Advancement</p>
                      <p className="font-paragraph text-sm text-primary/70">Multiple pathways for growth and specialization</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-paragraph font-semibold text-primary">Industry Demand</p>
                      <p className="font-paragraph text-sm text-primary/70">High demand across multiple sectors and geographies</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-paragraph font-semibold text-primary">Skill Development</p>
                      <p className="font-paragraph text-sm text-primary/70">Continuous learning opportunities and certifications</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-paragraph font-semibold text-primary">Entrepreneurial Opportunities</p>
                      <p className="font-paragraph text-sm text-primary/70">Potential to start your own venture or consultancy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-primary/10">
              <button
                onClick={() => setShowCareerModal(false)}
                className="flex-1 px-6 py-3 bg-primary/10 text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Close
              </button>
              <Link
                to={`/career/${selectedCareer._id}`}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                View Full Details <ArrowRight className="w-4 h-4" />
              </Link>
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
            Career Guidance & Exploration
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Search and explore 100+ careers, take a skill test to find your perfect match, or compare careers side by side.
          </p>
        </motion.div>
      </section>

      {/* Quick Actions Section */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Skill Test Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setShowSkillTest(true)}
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
                    Take a 15-question test to discover careers that match your interests and skills.
                  </p>
                </div>
              </div>
              <button className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
                Start Test <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Career Compare Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setShowCompare(true)}
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
                    Select two careers to compare salaries, skills, and growth opportunities.
                  </p>
                </div>
              </div>
              <button className="w-full mt-4 px-6 py-3 bg-secondary text-secondary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-secondary/90 transition-colors inline-flex items-center justify-center gap-2">
                Compare Now <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Career Search Section */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <h2 className="font-heading text-3xl font-bold text-primary mb-6">
              Explore All Careers
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
              <input
                type="text"
                placeholder="Search careers (e.g., Engineering, Medical, Business, IT, Creative...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <p className="font-paragraph text-sm text-primary/60 mt-3">
              Found {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''} matching your search
            </p>
          </motion.div>
        </div>
      </section>

      {/* Career Search Results */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-paragraph text-lg text-primary">Loading careers...</p>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <p className="font-paragraph text-xl text-primary/70">
                No careers found matching "{searchQuery}". Try searching with different keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers.map((career, index) => (
                <motion.div
                  key={career._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCareerClick(career)}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                >
                  {career.careerImage && (
                    <div className="h-48 overflow-hidden relative">
                      <Image
                        src={career.careerImage}
                        alt={career.careerName || 'Career'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        width={400}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                      {career.careerName}
                    </h3>
                    <p className="font-paragraph text-base text-primary/70 mb-4 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-primary/80">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-paragraph text-sm">
                          {formatCurrency(career.averageSalary)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-primary/80">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-paragraph text-sm">
                          {career.growthOutlook}
                        </span>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground font-paragraph text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
