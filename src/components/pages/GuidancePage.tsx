import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Video, Calendar, Brain, TrendingUp, DollarSign, GraduationCap, ArrowRight, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserGuidance, ExamsInformation } from '@/entities';
import { Image } from '@/components/ui/image';

export default function GuidancePage() {
  const [guidanceItems, setGuidanceItems] = useState<UserGuidance[]>([]);
  const [exams, setExams] = useState<ExamsInformation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  
  // Initial AI Questions State
  const [showInitialQuestions, setShowInitialQuestions] = useState(true);
  const [initialAnswers, setInitialAnswers] = useState<Record<number, string>>({});
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [guidanceRes, examsRes] = await Promise.all([
      BaseCrudService.getAll<UserGuidance>('userguidance'),
      BaseCrudService.getAll<ExamsInformation>('examsinformation')
    ]);
    setGuidanceItems(guidanceRes.items);
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
              <Link
                to="/skill-test"
                className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Start Test <ArrowRight className="w-4 h-4" />
              </Link>
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
                    Select two careers to compare salaries, skills, and growth opportunities.
                  </p>
                </div>
              </div>
              <Link
                to="/career-compare"
                className="w-full mt-4 px-6 py-3 bg-secondary text-secondary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-secondary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Compare Now <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

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
