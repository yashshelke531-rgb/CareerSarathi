import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Clock, Users, BookOpen, Target, ArrowLeft, ChevronDown, ChevronUp, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ExamsInformation, ExamSyllabus, ExamPreparationGuides, ExamTimetables } from '@/entities';
import { Image } from '@/components/ui/image';

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamsInformation | null>(null);
  const [syllabus, setSyllabus] = useState<ExamSyllabus[]>([]);
  const [guides, setGuides] = useState<ExamPreparationGuides[]>([]);
  const [timetables, setTimetables] = useState<ExamTimetables[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    syllabus: true,
    strategies: true,
    timetable: true,
    futureDates: true
  });
  const [selectedTimetableWeek, setSelectedTimetableWeek] = useState<number>(1);

  useEffect(() => {
    loadExamDetails();
  }, [id]);

  const loadExamDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [examRes, syllabusRes, guidesRes, timetablesRes] = await Promise.all([
        BaseCrudService.getById<ExamsInformation>('examsinformation', id),
        BaseCrudService.getAll<ExamSyllabus>('examsyllabus'),
        BaseCrudService.getAll<ExamPreparationGuides>('exampreparationguides'),
        BaseCrudService.getAll<ExamTimetables>('examtimetables')
      ]);

      setExam(examRes);
      setSyllabus(syllabusRes.items.filter(s => s.examId === id));
      setGuides(guidesRes.items.filter(g => g.examName?.toLowerCase() === examRes?.examName?.toLowerCase()));
      setTimetables(timetablesRes.items.filter(t => t.examId === id).sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0)));
    } catch (error) {
      console.error('Error loading exam details:', error);
    }
    setLoading(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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

  const calculateRemainingDays = (examDate?: Date | string) => {
    if (!examDate) return null;
    const exam = new Date(examDate);
    const today = new Date();
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = calculateRemainingDays(exam?.examDate);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-lg text-primary">Loading exam details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <p className="font-paragraph text-lg text-primary mb-4">Exam not found</p>
            <button
              onClick={() => navigate('/exams')}
              className="px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Exams
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
      <Header />

      {/* Back Button */}
      <section className="w-full bg-background py-4">
        <div className="max-w-[100rem] mx-auto px-6">
          <button
            onClick={() => navigate('/exams')}
            className="flex items-center gap-2 text-primary hover:text-primary/70 transition-colors font-paragraph text-base font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Exams
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full py-12">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Exam Logo */}
            {exam.examLogo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="md:col-span-1 flex items-center justify-center"
              >
                <div className="w-full h-64 bg-white rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                  <Image
                    src={exam.examLogo}
                    alt={exam.examName || 'Exam'}
                    className="w-full h-full object-cover"
                    width={300}
                  />
                </div>
              </motion.div>
            )}

            {/* Exam Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={exam.examLogo ? 'md:col-span-2' : 'md:col-span-3'}
            >
              <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                {exam.examName}
              </h1>
              <p className="font-paragraph text-xl text-primary/70 mb-8">
                {exam.description}
              </p>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Exam Date */}
                <div className="bg-white rounded-lg p-4 border-2 border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-paragraph text-xs text-primary/60 font-semibold">Exam Date</span>
                  </div>
                  <p className="font-heading text-sm font-bold text-primary">
                    {formatDate(exam.examDate)}
                  </p>
                </div>

                {/* Remaining Days */}
                {remainingDays !== null && (
                  <div className="bg-white rounded-lg p-4 border-2 border-secondary">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-secondary" />
                      <span className="font-paragraph text-xs text-primary/60 font-semibold">Days Left</span>
                    </div>
                    <p className="font-heading text-sm font-bold text-secondary">
                      {remainingDays} days
                    </p>
                  </div>
                )}

                {/* Application Deadline */}
                <div className="bg-white rounded-lg p-4 border-2 border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-paragraph text-xs text-primary/60 font-semibold">Deadline</span>
                  </div>
                  <p className="font-heading text-sm font-bold text-primary">
                    {formatDate(exam.applicationDeadline)}
                  </p>
                </div>

                {/* Exam Fee */}
                <div className="bg-white rounded-lg p-4 border-2 border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="font-paragraph text-xs text-primary/60 font-semibold">Fee</span>
                  </div>
                  <p className="font-heading text-sm font-bold text-primary">
                    {formatCurrency(exam.examFee)}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {exam.officialWebsite && (
                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 px-8 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Visit Official Website
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      {exam.eligibilityCriteria && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl p-8 border-2 border-primary/10"
            >
              <h2 className="font-heading text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Eligibility Criteria
              </h2>
              <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                {exam.eligibilityCriteria}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Syllabus Section */}
      {syllabus.length > 0 && (
        <section className="w-full py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl overflow-hidden border-2 border-primary/10"
            >
              <button
                onClick={() => toggleSection('syllabus')}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-background transition-colors"
              >
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Syllabus & Topics
                </h2>
                {expandedSections.syllabus ? (
                  <ChevronUp className="w-6 h-6 text-primary" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-primary" />
                )}
              </button>

              {expandedSections.syllabus && (
                <div className="px-8 pb-8 border-t border-primary/10 space-y-6">
                  {syllabus.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-background rounded-lg p-6 border-l-4 border-secondary"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-bold text-primary mb-2">
                            {item.subjectName}
                          </h3>
                          {item.topicsCovered && (
                            <div className="mb-3">
                              <p className="font-paragraph text-sm font-semibold text-primary/70 mb-1">Topics Covered:</p>
                              <p className="font-paragraph text-base text-primary/80">
                                {item.topicsCovered}
                              </p>
                            </div>
                          )}
                          {item.detailedContent && (
                            <div>
                              <p className="font-paragraph text-sm font-semibold text-primary/70 mb-1">Details:</p>
                              <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                                {item.detailedContent}
                              </p>
                            </div>
                          )}
                          {item.examBoard && (
                            <p className="font-paragraph text-xs text-primary/60 mt-3">
                              Board: {item.examBoard}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Preparation Strategies Section */}
      {guides.length > 0 && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-background rounded-xl overflow-hidden border-2 border-primary/10"
            >
              <button
                onClick={() => toggleSection('strategies')}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white transition-colors"
              >
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Preparation Strategies & Tips
                </h2>
                {expandedSections.strategies ? (
                  <ChevronUp className="w-6 h-6 text-primary" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-primary" />
                )}
              </button>

              {expandedSections.strategies && (
                <div className="px-8 pb-8 border-t border-primary/10 space-y-6">
                  {guides.map((guide, index) => (
                    <motion.div
                      key={guide._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-6 border-2 border-primary/10"
                    >
                      <h3 className="font-heading text-xl font-bold text-primary mb-4">
                        {guide.guideTitle}
                      </h3>

                      {guide.preparationStrategies && (
                        <div className="mb-4">
                          <h4 className="font-heading text-base font-bold text-primary mb-2">Strategies:</h4>
                          <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                            {guide.preparationStrategies}
                          </p>
                        </div>
                      )}

                      {guide.studyTips && (
                        <div className="mb-4">
                          <h4 className="font-heading text-base font-bold text-primary mb-2">Study Tips:</h4>
                          <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                            {guide.studyTips}
                          </p>
                        </div>
                      )}

                      {guide.detailedGuideContent && (
                        <div>
                          <h4 className="font-heading text-base font-bold text-primary mb-2">Detailed Guide:</h4>
                          <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                            {guide.detailedGuideContent}
                          </p>
                        </div>
                      )}

                      {guide.difficultyLevel && (
                        <div className="mt-4 pt-4 border-t border-primary/10">
                          <span className="inline-block px-3 py-1 bg-secondary rounded-full font-paragraph text-sm font-semibold text-secondary-foreground">
                            Difficulty: {guide.difficultyLevel}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Preparation Timetable Section */}
      {timetables.length > 0 && (
        <section className="w-full py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl overflow-hidden border-2 border-primary/10"
            >
              <button
                onClick={() => toggleSection('timetable')}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-background transition-colors"
              >
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Preparation Timetable
                </h2>
                {expandedSections.timetable ? (
                  <ChevronUp className="w-6 h-6 text-primary" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-primary" />
                )}
              </button>

              {expandedSections.timetable && (
                <div className="px-8 pb-8 border-t border-primary/10">
                  {/* Week Selector */}
                  <div className="mb-8">
                    <p className="font-paragraph text-sm font-semibold text-primary/70 mb-4">Select Week:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(timetables.map(t => t.weekNumber))).sort((a, b) => (a || 0) - (b || 0)).map(week => (
                        <button
                          key={week}
                          onClick={() => setSelectedTimetableWeek(week || 1)}
                          className={`px-4 py-2 rounded-lg font-paragraph text-base font-semibold transition-all ${
                            selectedTimetableWeek === week
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background text-primary border-2 border-primary/20 hover:border-primary'
                          }`}
                        >
                          Week {week}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timetable for Selected Week */}
                  <div className="space-y-4">
                    {timetables
                      .filter(t => t.weekNumber === selectedTimetableWeek)
                      .map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-background rounded-lg p-6 border-l-4 border-secondary"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="font-paragraph text-xs text-primary/60 font-semibold mb-1">Day</p>
                              <p className="font-heading text-lg font-bold text-primary">
                                {item.dayOfWeek}
                              </p>
                            </div>
                            <div>
                              <p className="font-paragraph text-xs text-primary/60 font-semibold mb-1">Study Hours</p>
                              <p className="font-heading text-lg font-bold text-secondary">
                                {item.hoursPerDay} hrs
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="font-paragraph text-xs text-primary/60 font-semibold mb-1">Topics</p>
                              <p className="font-paragraph text-base text-primary/80">
                                {item.topicsToCover}
                              </p>
                            </div>
                          </div>

                          {item.dailyPlan && (
                            <div className="pt-4 border-t border-primary/10">
                              <p className="font-paragraph text-sm font-semibold text-primary/70 mb-2">Daily Plan:</p>
                              <p className="font-paragraph text-base text-primary/80 leading-relaxed">
                                {item.dailyPlan}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Future Exam Dates Section */}
      {exam.futureExamDates && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-background rounded-xl overflow-hidden border-2 border-primary/10"
            >
              <button
                onClick={() => toggleSection('futureDates')}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white transition-colors"
              >
                <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Future Exam Dates
                </h2>
                {expandedSections.futureDates ? (
                  <ChevronUp className="w-6 h-6 text-primary" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-primary" />
                )}
              </button>

              {expandedSections.futureDates && (
                <div className="px-8 pb-8 border-t border-primary/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exam.futureExamDates.split(',').map((date, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-6 border-2 border-secondary text-center"
                      >
                        <Calendar className="w-8 h-8 text-secondary mx-auto mb-3" />
                        <p className="font-heading text-lg font-bold text-primary">
                          {date.trim()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
