import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, FileText, Trophy, Clock, Users, BookOpen, Target, ArrowRight, Search as SearchIcon, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ExamsInformation } from '@/entities';
import { Image } from '@/components/ui/image';

interface ExamCategory {
  name: string;
  description: string;
  exams: ExamsInformation[];
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamsInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<ExamsInformation>('examsinformation');
    setExams(items);
    setLoading(false);
  };

  const examCategories: Record<string, ExamCategory> = {
    'Engineering': {
      name: 'Engineering Entrance Exams',
      description: 'Competitive exams for engineering aspirants',
      exams: exams.filter(e => e.examName?.toLowerCase().includes('jee') || e.examName?.toLowerCase().includes('gate'))
    },
    'Medical': {
      name: 'Medical Entrance Exams',
      description: 'Competitive exams for medical aspirants',
      exams: exams.filter(e => e.examName?.toLowerCase().includes('neet') || e.examName?.toLowerCase().includes('aiims'))
    },
    'Civil Service': {
      name: 'Civil Service Exams',
      description: 'Government job entrance exams',
      exams: exams.filter(e => e.examName?.toLowerCase().includes('upsc') || e.examName?.toLowerCase().includes('ias'))
    },
    'Banking': {
      name: 'Banking & Finance Exams',
      description: 'Banking sector competitive exams',
      exams: exams.filter(e => e.examName?.toLowerCase().includes('bank') || e.examName?.toLowerCase().includes('sbi'))
    },
    'Other': {
      name: 'Other Competitive Exams',
      description: 'Various other competitive exams',
      exams: exams.filter(e => 
        !e.examName?.toLowerCase().includes('jee') && 
        !e.examName?.toLowerCase().includes('neet') && 
        !e.examName?.toLowerCase().includes('upsc') &&
        !e.examName?.toLowerCase().includes('bank')
      )
    }
  };

  const categories = Object.keys(examCategories).filter(cat => examCategories[cat].exams.length > 0);

  const filteredExams = selectedCategory === 'All'
    ? exams
    : examCategories[selectedCategory]?.exams || [];

  const searchedExams = filteredExams.filter(exam =>
    exam.examName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date?: Date | string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-secondary" />
            <span className="font-paragraph text-sm font-semibold text-secondary">COMPETITIVE EXAMS</span>
          </div>
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">
            Popular Competitive Exams in India
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            A-Z coverage of India's most popular competitive exams with comprehensive guidance on how to crack them from scratch and career paths after success.
          </p>
        </motion.div>
      </section>

      {/* Search & Filter Section */}
      <section className="w-full bg-background py-8">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exams..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-primary/20 bg-white text-primary font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-3 rounded-lg font-paragraph text-base font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-primary border-2 border-primary/20 hover:border-primary'
                }`}
              >
                All Exams
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-paragraph text-base font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-primary border-2 border-primary/20 hover:border-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="font-paragraph text-base text-primary/70">
            Showing {searchedExams.length} exam{searchedExams.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="w-full py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-paragraph text-lg text-primary">Loading exams...</p>
            </div>
          ) : searchedExams.length === 0 ? (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <p className="font-paragraph text-lg text-primary/70">No exams found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchedExams.map((exam, index) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Exam Logo */}
                  {exam.examLogo && (
                    <div className="h-40 bg-background overflow-hidden flex items-center justify-center">
                      <Image
                        src={exam.examLogo}
                        alt={exam.examName || 'Exam'}
                        className="w-full h-full object-cover"
                        width={400}
                      />
                    </div>
                  )}

                  {/* Exam Details */}
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                      {exam.examName}
                    </h3>
                    <p className="font-paragraph text-base text-primary/70 mb-6 line-clamp-2">
                      {exam.description}
                    </p>

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Exam Date */}
                      <div className="bg-background rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-xs text-primary/60 font-semibold">Exam Date</span>
                        </div>
                        <p className="font-heading text-sm font-bold text-primary">
                          {formatDate(exam.examDate)}
                        </p>
                      </div>

                      {/* Application Deadline */}
                      <div className="bg-background rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-xs text-primary/60 font-semibold">Deadline</span>
                        </div>
                        <p className="font-heading text-sm font-bold text-primary">
                          {formatDate(exam.applicationDeadline)}
                        </p>
                      </div>

                      {/* Exam Fee */}
                      <div className="bg-background rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-xs text-primary/60 font-semibold">Fee</span>
                        </div>
                        <p className="font-heading text-sm font-bold text-primary">
                          {formatCurrency(exam.examFee)}
                        </p>
                      </div>

                      {/* Eligibility */}
                      <div className="bg-background rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-paragraph text-xs text-primary/60 font-semibold">Eligibility</span>
                        </div>
                        <p className="font-heading text-sm font-bold text-primary line-clamp-1">
                          {exam.eligibilityCriteria ? 'Check Details' : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/exam/${exam._id}`}
                        className="flex-1 px-4 py-3 bg-background text-primary font-paragraph text-base font-semibold rounded-lg hover:bg-primary/10 transition-colors text-center"
                      >
                        View Details
                      </Link>
                      {exam.officialWebsite && (
                        <a
                          href={exam.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          Official Site <ArrowRight className="w-4 h-4" />
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

      {/* Guidance Section */}
      <section className="w-full bg-background py-16">
        <div className="max-w-[100rem] mx-auto px-6">
          <h2 className="font-heading text-4xl font-bold text-primary mb-12 text-center">
            How to Crack Competitive Exams from Scratch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Understand the Exam',
                description: 'Study the exam pattern, syllabus, marking scheme, and previous year papers to understand what to expect.'
              },
              {
                step: '2',
                title: 'Create a Study Plan',
                description: 'Develop a structured study schedule covering all topics with adequate time for revision and practice.'
              },
              {
                step: '3',
                title: 'Practice Regularly',
                description: 'Solve mock tests, practice problems, and previous year papers to build speed and accuracy.'
              },
              {
                step: '4',
                title: 'Analyze & Improve',
                description: 'Review your performance, identify weak areas, and focus on continuous improvement.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl border-2 border-primary/10 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <span className="font-heading text-lg font-bold text-secondary-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="font-paragraph text-sm text-primary/70">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths Section */}
      <section className="w-full py-16">
        <div className="max-w-[100rem] mx-auto px-6">
          <h2 className="font-heading text-4xl font-bold text-primary mb-12 text-center">
            Career Paths After Competitive Exams
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                exam: 'JEE/GATE',
                careers: ['Software Engineer', 'Data Scientist', 'Mechanical Engineer', 'Civil Engineer'],
                icon: BookOpen
              },
              {
                exam: 'NEET/AIIMS',
                careers: ['Doctor', 'Surgeon', 'Medical Researcher', 'Healthcare Administrator'],
                icon: Trophy
              },
              {
                exam: 'UPSC/IAS',
                careers: ['IAS Officer', 'IPS Officer', 'Forest Officer', 'Government Administrator'],
                icon: Target
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl border-2 border-primary/10 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary">
                      {item.exam}
                    </h3>
                  </div>
                  <p className="font-paragraph text-sm text-primary/70 mb-4">
                    Popular career paths after clearing this exam:
                  </p>
                  <ul className="space-y-2">
                    {item.careers.map((career, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span className="font-paragraph text-sm text-primary/80">
                          {career}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
