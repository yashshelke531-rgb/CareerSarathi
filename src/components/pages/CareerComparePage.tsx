import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, GraduationCap, Briefcase, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { PopularCareers } from '@/entities';
import { Image } from '@/components/ui/image';
import { useCareerStore } from '@/stores/careerStore';

export default function CareerComparePage() {
  const [careers, setCareers] = useState<PopularCareers[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCareers, toggleCareerSelection, testResults } = useCareerStore();

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<PopularCareers>('popularcareers');
    setCareers(items);
    setLoading(false);
  };

  const getSelectedCareerData = () => {
    return careers.filter(career => selectedCareers.includes(career._id));
  };

  const handleCareerSelection = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      // Deselect if already selected
      toggleCareerSelection(careerId);
    } else if (selectedCareers.length < 2) {
      // Select if less than 2 are selected
      toggleCareerSelection(careerId);
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRecommendation = () => {
    if (selectedCareers.length !== 2 || testResults.length === 0) return null;

    const selectedData = getSelectedCareerData();
    const recommendations = selectedData.map(career => {
      const matchResult = testResults.find(r => r.careerName === career.careerName);
      return {
        career: career.careerName,
        matchPercentage: matchResult?.matchPercentage || 0,
        salary: career.averageSalary || 0
      };
    });

    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    if (recommendations[0].matchPercentage > recommendations[1].matchPercentage) {
      return {
        recommended: recommendations[0].career,
        reason: `Based on your skill test results, ${recommendations[0].career} is a better match with ${recommendations[0].matchPercentage}% compatibility.`,
        matchDiff: recommendations[0].matchPercentage - recommendations[1].matchPercentage,
        salaryDiff: recommendations[0].salary - recommendations[1].salary
      };
    }
    
    return {
      recommended: recommendations[0].career,
      reason: `Both careers are equally suited to your skills. Choose based on your personal preferences and interests.`,
      matchDiff: 0,
      salaryDiff: recommendations[0].salary - recommendations[1].salary
    };
  };

  const recommendation = getRecommendation();

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
            Compare Careers
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Select two careers to compare salaries, skills, and growth opportunities. Get AI-powered recommendations based on your skill test results.
          </p>
        </motion.div>
      </section>

      {/* Career Selection Section */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-primary mb-2">
            Select Careers to Compare
          </h2>
          <p className="font-paragraph text-base text-primary/70 mb-8">
            Click on careers to select them for comparison (select exactly 2)
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-paragraph text-lg text-primary">Loading careers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {careers.map((career) => (
                <motion.div
                  key={career._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedCareers.includes(career._id) ? 'ring-4 ring-secondary shadow-lg' : 'hover:shadow-lg'
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
                  <div className="bg-white p-6">
                    <h3 className="font-heading text-xl font-bold text-primary mb-2">
                      {career.careerName}
                    </h3>
                    <p className="font-paragraph text-sm text-primary/70 mb-4 line-clamp-2">
                      {career.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary/80 mb-3">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-paragraph text-sm font-semibold">
                        {formatCurrency(career.averageSalary)}
                      </span>
                    </div>
                    {selectedCareers.includes(career._id) && (
                      <div className="flex items-center gap-2 text-secondary mt-3 pt-3 border-t border-primary/10">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-paragraph text-sm font-semibold">Selected</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedCareers.length > 0 && (
            <div className="text-center space-y-4">
              <p className="font-paragraph text-base text-primary/70">
                {selectedCareers.length === 2 ? '✓ Ready to compare!' : `Select ${2 - selectedCareers.length} more career(s) to compare`}
              </p>
              {selectedCareers.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => {
                      const comparisonSection = document.getElementById('comparison-section');
                      if (comparisonSection) {
                        comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="px-8 py-3 bg-secondary text-secondary-foreground font-paragraph font-semibold rounded-full hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
                  >
                    View Comparison <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      {selectedCareers.length === 2 && (
        <section id="comparison-section" className="w-full py-20">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-12 mb-12"
            >
              <h2 className="font-heading text-4xl font-bold text-primary mb-12 text-center">
                Career Comparison
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {getSelectedCareerData().map((career, index) => {
                  const matchResult = testResults.find(r => r.careerName === career.careerName);
                  return (
                    <motion.div
                      key={career._id}
                      initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-background rounded-xl p-8 border-2 border-primary/10"
                    >
                      <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                        {career.careerName}
                      </h3>

                      <div className="space-y-6">
                        {/* Salary */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <h4 className="font-heading text-lg font-semibold text-primary">
                              Average Salary
                            </h4>
                          </div>
                          <p className="font-heading text-3xl font-bold text-secondary ml-7">
                            {formatCurrency(career.averageSalary)}
                          </p>
                        </div>

                        {/* Growth Outlook */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h4 className="font-heading text-lg font-semibold text-primary">
                              Growth Outlook
                            </h4>
                          </div>
                          <p className="font-paragraph text-base text-primary/80 ml-7">
                            {career.growthOutlook}
                          </p>
                        </div>

                        {/* Education */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <h4 className="font-heading text-lg font-semibold text-primary">
                              Education Required
                            </h4>
                          </div>
                          <p className="font-paragraph text-base text-primary/80 ml-7">
                            {career.educationalRequirements}
                          </p>
                        </div>

                        {/* Skills */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <h4 className="font-heading text-lg font-semibold text-primary">
                              Required Skills
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2 ml-7">
                            {career.requiredSkills?.split(',').map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-secondary text-secondary-foreground font-paragraph text-sm rounded-full"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Skill Test Match */}
                        {matchResult && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="w-5 h-5 text-primary" />
                              <h4 className="font-heading text-lg font-semibold text-primary">
                                Your Match
                              </h4>
                            </div>
                            <div className="ml-7">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-paragraph text-base text-primary/80">
                                  Skill Compatibility
                                </span>
                                <span className="font-heading text-2xl font-bold text-secondary">
                                  {matchResult.matchPercentage}%
                                </span>
                              </div>
                              <div className="w-full bg-primary/10 rounded-full h-3">
                                <div
                                  className="bg-secondary h-3 rounded-full transition-all"
                                  style={{ width: `${matchResult.matchPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recommendation */}
              {recommendation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-xl p-8 border-2 border-secondary"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                        AI Recommendation
                      </h3>
                      <p className="font-paragraph text-base text-primary/80 mb-4">
                        {recommendation.reason}
                      </p>
                      {recommendation.matchDiff > 0 && (
                        <div className="flex items-center gap-2 text-primary/70">
                          <ArrowRight className="w-4 h-4" />
                          <span className="font-paragraph text-sm">
                            {recommendation.recommended} has {recommendation.matchDiff}% higher compatibility with your skills.
                          </span>
                        </div>
                      )}
                      {recommendation.salaryDiff !== 0 && (
                        <div className="flex items-center gap-2 text-primary/70 mt-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-paragraph text-sm">
                            Salary difference: {formatCurrency(Math.abs(recommendation.salaryDiff))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {selectedCareers.length === 0 && !loading && (
        <section className="w-full py-20">
          <div className="max-w-[100rem] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-12 max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                Select Careers to Get Started
              </h2>
              <p className="font-paragraph text-base text-primary/70">
                Choose two careers from the list above to compare their salaries, skills, and growth opportunities.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
