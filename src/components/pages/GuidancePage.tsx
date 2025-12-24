import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserGuidance } from '@/entities';
import { Image } from '@/components/ui/image';

export default function GuidancePage() {
  const [guidanceItems, setGuidanceItems] = useState<UserGuidance[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGuidance();
  }, []);

  const loadGuidance = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<UserGuidance>('userguidance');
    setGuidanceItems(items);
    setLoading(false);
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
            Career Guidance Resources
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Comprehensive guides, tutorials, and insights to help you navigate your career journey with confidence.
          </p>
        </motion.div>
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

      {/* Additional Resources */}
      <section className="w-full bg-background py-20">
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
                <Calendar className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                Regular Updates
              </h3>
              <p className="font-paragraph text-base text-primary/70">
                Fresh content updated regularly to reflect the latest career trends and opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
