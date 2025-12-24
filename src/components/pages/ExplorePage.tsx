import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, GraduationCap, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { PopularCareers, ExamsInformation } from '@/entities';
import { Image } from '@/components/ui/image';

export default function ExplorePage() {
  const [careers, setCareers] = useState<PopularCareers[]>([]);
  const [exams, setExams] = useState<ExamsInformation[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { items: careerItems } = await BaseCrudService.getAll<PopularCareers>('popularcareers');
    const { items: examItems } = await BaseCrudService.getAll<ExamsInformation>('examsinformation');
    setCareers(careerItems);
    setExams(examItems);
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

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">
            Explore Career Opportunities
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Discover trending careers, compare paths, and find the perfect exams to advance your professional goals.
          </p>
        </motion.div>
      </section>

      {/* Popular Careers Section */}
      <section className="w-full bg-background py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-heading text-5xl font-bold text-primary mb-4">
                Popular Careers
              </h2>
              <p className="font-paragraph text-lg text-primary/70">
                Select up to 3 careers to compare side by side
              </p>
            </div>
            {selectedCareers.length >= 2 && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-6 py-3 bg-secondary text-secondary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
              >
                {showComparison ? 'Hide Comparison' : 'Compare Selected'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {careers.map((career, index) => (
              <motion.div
                key={career._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                  selectedCareers.includes(career._id) ? 'ring-4 ring-secondary' : ''
                }`}
                onClick={() => toggleCareerSelection(career._id)}
              >
                {career.careerImage && (
                  <div className="h-48 overflow-hidden">
                    <Image
                      src={career.careerImage}
                      alt={career.careerName || 'Career'}
                      className="w-full h-full object-cover"
                      width={400}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                    {career.careerName}
                  </h3>
                  <p className="font-paragraph text-base text-primary/70 mb-4 line-clamp-3">
                    {career.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-primary/80">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-paragraph text-sm">
                        Avg. Salary: {formatCurrency(career.averageSalary)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary/80">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-paragraph text-sm">
                        Growth: {career.growthOutlook}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/career/${career._id}`}
                    className="inline-flex items-center gap-2 font-paragraph text-base text-primary font-semibold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          {showComparison && selectedCareers.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-xl p-8 overflow-x-auto"
            >
              <h3 className="font-heading text-3xl font-bold text-primary mb-6">
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
                      <td key={career._id} className="p-4 font-paragraph text-base text-primary/80">
                        {career.requiredSkills}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-primary/10">
                    <td className="p-4 font-paragraph text-base font-semibold text-primary">
                      Education Requirements
                    </td>
                    {getSelectedCareerData().map(career => (
                      <td key={career._id} className="p-4 font-paragraph text-base text-primary/80">
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

      {/* Exams Information Section */}
      <section className="w-full py-20">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-5xl font-bold text-primary mb-4">
              Important Exams
            </h2>
            <p className="font-paragraph text-lg text-primary/70 max-w-3xl mx-auto">
              Stay informed about key entrance exams and certification tests for your career path.
            </p>
          </div>

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
                    {exam.officialWebsite && (
                      <a
                        href={exam.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-paragraph text-base text-primary font-semibold hover:underline"
                      >
                        Visit Official Website <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
