import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Video, Calendar, Brain, TrendingUp, DollarSign, GraduationCap, ArrowRight, X, Search, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserGuidance, ExamsInformation, PopularCareers } from '@/entities';
import { Image } from '@/components/ui/image';
import { careersData } from '@/data/careersData';

export default function GuidancePage() {
  const [guidanceItems, setGuidanceItems] = useState<UserGuidance[]>([]);
  const [exams, setExams] = useState<ExamsInformation[]>([]);
  const [careers, setCareers] = useState<PopularCareers[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<PopularCareers | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [guidanceRes, examsRes, careersRes] = await Promise.all([
        BaseCrudService.getAll<UserGuidance>('userguidance'),
        BaseCrudService.getAll<ExamsInformation>('examsinformation'),
        BaseCrudService.getAll<PopularCareers>('popularcareers')
      ]);
      setGuidanceItems(guidanceRes.items);
      setExams(examsRes.items);
      // Use CMS data if available, otherwise use local data
      setCareers(careersRes.items && careersRes.items.length > 0 ? careersRes.items : careersData as any);
    } catch (error) {
      // Fallback to local data if CMS fails
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



  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
      <Header />

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
            Search and explore 100+ careers with comprehensive details including requirements, eligibility, salary, and growth potential.
          </p>
        </motion.div>
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
              Search for Your Dream Career
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
