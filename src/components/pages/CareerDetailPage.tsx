import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, TrendingUp, GraduationCap, Briefcase } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { PopularCareers } from '@/entities';
import { Image } from '@/components/ui/image';

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [career, setCareer] = useState<PopularCareers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareer();
  }, [id]);

  const loadCareer = async () => {
    if (!id) return;
    setLoading(true);
    const careerData = await BaseCrudService.getById<PopularCareers>('popularcareers', id);
    setCareer(careerData);
    setLoading(false);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-lg text-primary">Loading career details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">Career Not Found</h2>
            <Link to="/explore" className="font-paragraph text-lg text-primary hover:underline">
              ← Back to Explore
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
      <Header />

      <section className="w-full max-w-[100rem] mx-auto px-6 py-12">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 font-paragraph text-base text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden shadow-xl"
        >
          {career.careerImage && (
            <div className="h-96 overflow-hidden">
              <Image
                src={career.careerImage}
                alt={career.careerName || 'Career'}
                className="w-full h-full object-cover"
                width={1200}
              />
            </div>
          )}

          <div className="p-12">
            <h1 className="font-heading text-6xl font-bold text-primary mb-6">
              {career.careerName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-secondary p-6 rounded-lg">
                <DollarSign className="w-8 h-8 text-secondary-foreground mb-3" />
                <h3 className="font-heading text-sm font-semibold text-secondary-foreground/70 mb-1">
                  Average Salary
                </h3>
                <p className="font-heading text-2xl font-bold text-secondary-foreground">
                  {formatCurrency(career.averageSalary)}
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading text-sm font-semibold text-primary/70 mb-1">
                  Growth Outlook
                </h3>
                <p className="font-heading text-2xl font-bold text-primary">
                  {career.growthOutlook}
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg">
                <GraduationCap className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading text-sm font-semibold text-primary/70 mb-1">
                  Education Level
                </h3>
                <p className="font-paragraph text-base font-semibold text-primary">
                  {career.educationalRequirements?.split(',')[0] || 'Varies'}
                </p>
              </div>

              <div className="bg-secondary p-6 rounded-lg">
                <Briefcase className="w-8 h-8 text-secondary-foreground mb-3" />
                <h3 className="font-heading text-sm font-semibold text-secondary-foreground/70 mb-1">
                  Career Type
                </h3>
                <p className="font-paragraph text-base font-semibold text-secondary-foreground">
                  Professional
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                  Overview
                </h2>
                <p className="font-paragraph text-lg text-primary/80 leading-relaxed">
                  {career.description}
                </p>
              </div>

              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {career.requiredSkills?.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary text-secondary-foreground font-paragraph text-base rounded-lg"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                  Educational Requirements
                </h2>
                <div className="bg-background p-6 rounded-lg">
                  <p className="font-paragraph text-lg text-primary/80">
                    {career.educationalRequirements}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                  Career Growth & Opportunities
                </h2>
                <div className="bg-background p-6 rounded-lg">
                  <p className="font-paragraph text-lg text-primary/80">
                    This career path shows {career.growthOutlook?.toLowerCase()} growth potential. 
                    With the right skills and experience, professionals in this field can expect 
                    competitive compensation and diverse opportunities across various industries.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-primary/10">
              <Link
                to="/explore"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore More Careers
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
