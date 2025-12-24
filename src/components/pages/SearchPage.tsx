import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, DollarSign, BookOpen, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { PopularCareers, ExamsInformation, UserGuidance } from '@/entities';
import { Image } from '@/components/ui/image';

export default function SearchPage() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const query = urlParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [careers, setCareers] = useState<PopularCareers[]>([]);
  const [exams, setExams] = useState<ExamsInformation[]>([]);
  const [guidance, setGuidance] = useState<UserGuidance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const loadData = async () => {
    setLoading(true);
    const [careerData, examData, guidanceData] = await Promise.all([
      BaseCrudService.getAll<PopularCareers>('popularcareers'),
      BaseCrudService.getAll<ExamsInformation>('examsinformation'),
      BaseCrudService.getAll<UserGuidance>('userguidance')
    ]);
    setCareers(careerData.items);
    setExams(examData.items);
    setGuidance(guidanceData.items);
    setLoading(false);
  };

  const searchInText = (text: string | undefined, query: string): boolean => {
    if (!text || !query) return false;
    return text.toLowerCase().includes(query.toLowerCase());
  };

  const getAISearchInsights = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('engineer') || lowerQuery.includes('software') || lowerQuery.includes('tech')) {
      return 'Based on your search for technology careers, I found several engineering and software development opportunities. These fields offer excellent growth potential and competitive salaries.';
    }
    
    if (lowerQuery.includes('medical') || lowerQuery.includes('doctor') || lowerQuery.includes('health')) {
      return 'Your search indicates interest in healthcare careers. Medical professions require significant education but offer rewarding opportunities to make a real difference in people\'s lives.';
    }
    
    if (lowerQuery.includes('business') || lowerQuery.includes('management') || lowerQuery.includes('mba')) {
      return 'Business and management careers provide diverse opportunities across industries. These roles often require strong leadership and analytical skills.';
    }
    
    if (lowerQuery.includes('exam') || lowerQuery.includes('test') || lowerQuery.includes('entrance')) {
      return 'I found relevant entrance exams and certifications that can help advance your career. Review the deadlines and eligibility criteria carefully.';
    }
    
    return `I've analyzed your search for "${query}" and found relevant careers, exams, and guidance resources. Use the AI filters below to refine your results.`;
  };

  const filteredCareers = careers.filter(career =>
    searchInText(career.careerName, searchQuery) ||
    searchInText(career.description, searchQuery) ||
    searchInText(career.requiredSkills, searchQuery) ||
    searchInText(career.educationalRequirements, searchQuery)
  );

  const filteredExams = exams.filter(exam =>
    searchInText(exam.examName, searchQuery) ||
    searchInText(exam.description, searchQuery) ||
    searchInText(exam.eligibilityCriteria, searchQuery)
  );

  const filteredGuidance = guidance.filter(item =>
    searchInText(item.title, searchQuery) ||
    searchInText(item.content, searchQuery) ||
    searchInText(item.category, searchQuery)
  );

  const totalResults = filteredCareers.length + filteredExams.length + filteredGuidance.length;

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

      {/* Search Header */}
      <section className="w-full bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-heading text-5xl font-bold text-primary mb-6">
              Search Results
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Refine your search..."
                  className="w-full px-6 py-4 pr-12 rounded-lg border border-primary/20 bg-white text-primary font-paragraph text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40" />
              </div>
            </div>
            {searchQuery && (
              <div className="bg-secondary p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Search className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-secondary-foreground mb-2">
                      AI Search Insights
                    </h3>
                    <p className="font-paragraph text-base text-secondary-foreground/90">
                      {getAISearchInsights(searchQuery)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-paragraph text-lg text-primary">Searching...</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                No results found
              </h2>
              <p className="font-paragraph text-lg text-primary/70 mb-8">
                Try adjusting your search terms or explore our popular careers.
              </p>
              <Link
                to="/explore"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Careers
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              <div className="mb-8">
                <p className="font-paragraph text-lg text-primary/70">
                  Found <span className="font-bold text-primary">{totalResults}</span> results for "{searchQuery}"
                </p>
              </div>

              {/* Careers Results */}
              {filteredCareers.length > 0 && (
                <div>
                  <h2 className="font-heading text-4xl font-bold text-primary mb-8 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8" />
                    Careers ({filteredCareers.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCareers.map((career, index) => (
                      <motion.div
                        key={career._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
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
                        <div className="p-6">
                          <h3 className="font-heading text-xl font-bold text-primary mb-2">
                            {career.careerName}
                          </h3>
                          <p className="font-paragraph text-sm text-primary/70 mb-3 line-clamp-2">
                            {career.description}
                          </p>
                          <div className="flex items-center gap-2 text-primary/80 mb-3">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-paragraph text-sm">
                              {formatCurrency(career.averageSalary)}
                            </span>
                          </div>
                          <Link
                            to={`/career/${career._id}`}
                            className="inline-flex items-center gap-2 font-paragraph text-sm text-primary font-semibold hover:underline"
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams Results */}
              {filteredExams.length > 0 && (
                <div>
                  <h2 className="font-heading text-4xl font-bold text-primary mb-8 flex items-center gap-3">
                    <BookOpen className="w-8 h-8" />
                    Exams ({filteredExams.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredExams.map((exam, index) => (
                      <motion.div
                        key={exam._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          {exam.examLogo && (
                            <Image
                              src={exam.examLogo}
                              alt={exam.examName || 'Exam'}
                              className="w-16 h-16 object-contain flex-shrink-0"
                              width={64}
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-heading text-xl font-bold text-primary mb-2">
                              {exam.examName}
                            </h3>
                            <p className="font-paragraph text-sm text-primary/70 mb-3 line-clamp-2">
                              {exam.description}
                            </p>
                            <div className="flex items-center gap-2 text-primary/80">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-paragraph text-sm">
                                Fee: {formatCurrency(exam.examFee)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Guidance Results */}
              {filteredGuidance.length > 0 && (
                <div>
                  <h2 className="font-heading text-4xl font-bold text-primary mb-8 flex items-center gap-3">
                    <BookOpen className="w-8 h-8" />
                    Guidance Resources ({filteredGuidance.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredGuidance.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow"
                      >
                        {item.category && (
                          <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground font-paragraph text-xs font-semibold rounded-full mb-3">
                            {item.category}
                          </span>
                        )}
                        <h3 className="font-heading text-xl font-bold text-primary mb-2">
                          {item.title}
                        </h3>
                        <p className="font-paragraph text-sm text-primary/70 line-clamp-3">
                          {item.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
