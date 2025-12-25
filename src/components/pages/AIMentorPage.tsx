import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageCircle, Lightbulb, BookOpen, Briefcase } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const COMPREHENSIVE_RESPONSES: Record<string, string> = {
  // College and University Queries
  college_maharashtra: "Top Engineering Colleges in Maharashtra: 1) IIT Bombay - Premier institute for engineering with excellent placements, 2) COEP Pune - Oldest engineering college in Asia with strong alumni network, 3) NIT Nagpur - National Institute of Technology with good infrastructure, 4) VJTI Mumbai - Veermata Jijabai Technological Institute with diverse programs, 5) MIT Pune - Maharashtra Institute of Technology with industry connections. Admission through JEE Main/Advanced. These colleges offer excellent placements (₹8-25+ lakhs), strong faculty, and industry partnerships. Would you like information about specific branches or placement statistics?",
  
  college_medical: "Top Medical Colleges in India: 1) AIIMS Delhi, Mumbai, Bangalore - Premier government medical institutes with world-class facilities, 2) CMC Vellore - Christian Medical College with excellent clinical training, 3) JIPMER Puducherry - Jawaharlal Institute of Postgraduate Medical Education and Research, 4) King George's Medical University Lucknow. For Maharashtra: Seth GS Medical College Mumbai, BJ Medical College Pune. Admission through NEET. These offer excellent clinical training, research opportunities, and strong faculty. Salary range: ₹3-30+ lakhs depending on specialization.",
  
  college_general: "College selection depends on: 1) Your field of interest (engineering, medical, management, arts), 2) Entrance exam scores (JEE, NEET, CAT), 3) Location preference, 4) Career goals. Consider: Accreditation and rankings, Faculty expertise, Placement records (average salary, companies recruiting), Campus facilities, Alumni network, Scholarship opportunities. Top colleges offer better placements, networking, and career growth. What field are you interested in?",
  
  // Career-related responses
  career_general: "Careers are professional paths that align with your skills, interests, and values. There are thousands of career options across industries like IT, healthcare, finance, engineering, education, arts, and more. Each career has unique requirements, salary ranges, growth prospects, and work environments. I can help you explore specific careers, understand their requirements, and find the best fit for you.",
  
  career_it: "IT careers include Software Engineer, Data Scientist, Cloud Architect, Cybersecurity Specialist, AI/ML Engineer, and more. These roles typically require strong problem-solving skills, programming knowledge, and continuous learning. Salaries are competitive, ranging from ₹4-20+ lakhs annually. Growth opportunities are excellent with high demand globally. Top companies: Google, Microsoft, Amazon, TCS, Infosys. Specializations: Web Development, Mobile Apps, Cloud Computing, AI/ML, DevOps.",
  
  career_healthcare: "Healthcare careers span doctors, nurses, therapists, pharmacists, medical researchers, and healthcare administrators. These require relevant degrees (MBBS, BNSc, etc.), compassion, and dedication. Salaries vary widely (₹3-30+ lakhs). Job security is excellent with consistent demand and opportunities for specialization. Specializations: Surgery, Pediatrics, Cardiology, Psychiatry, Orthopedics. Work environment: Hospitals, clinics, research centers, NGOs.",
  
  career_finance: "Finance careers include investment banker, financial analyst, accountant, insurance agent, and financial advisor. These require strong analytical skills, certifications (CA, CFA), and attention to detail. Salaries range from ₹4-25+ lakhs. Growth is steady with opportunities in banking, stock markets, and corporate finance. Top companies: Goldman Sachs, JP Morgan, ICICI Bank, HDFC Bank. Skills: Financial modeling, data analysis, market knowledge.",
  
  career_engineering: "Engineering careers cover civil, mechanical, electrical, chemical, and software engineering. These require engineering degrees and technical expertise. Salaries range from ₹3-20+ lakhs. Opportunities exist in construction, manufacturing, power, and technology sectors with good growth prospects. Specializations: Structural engineering, Power systems, Automotive, Aerospace. Top companies: Larsen & Toubro, Bharat Heavy Electricals, Siemens.",
  
  career_education: "Teaching and education careers include teachers, professors, educational consultants, and curriculum designers. These require teaching qualifications and subject expertise. Salaries range from ₹2-15+ lakhs. Job security is good with opportunities in schools, colleges, and online platforms. Specializations: K-12 teaching, Higher education, EdTech, Curriculum design. Growth: Online education, skill-based learning, corporate training.",
  
  career_business: "Business careers include management consultant, business analyst, entrepreneur, and operations manager. These require business acumen, leadership skills, and often an MBA. Salaries range from ₹5-30+ lakhs. Growth is excellent with opportunities in startups and established companies. Top MBA colleges: IIM Ahmedabad, IIM Bangalore, XLRI, ISB. Skills: Strategic thinking, communication, analytical abilities.",
  
  // Exam-related responses
  exam_general: "Competitive exams are standardized tests that determine eligibility for higher education or government jobs. Major exams include JEE (engineering), NEET (medical), UPSC (civil services), CAT (MBA), and many others. Each exam has specific syllabi, difficulty levels, and preparation strategies. Success requires consistent study, practice, and strategic planning.",
  
  exam_jee: "JEE (Joint Entrance Examination) has two levels: JEE Main and JEE Advanced. It's for engineering admission in top colleges like IITs. Syllabus covers Physics, Chemistry, and Mathematics. Preparation typically takes 1-2 years. Success rate is low (around 1-2%) due to high competition. Mock tests and previous year papers are essential. Top colleges: IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur.",
  
  exam_neet: "NEET (National Eligibility cum Entrance Test) is for medical and dental college admission. Syllabus includes Physics, Chemistry, and Biology. It's highly competitive with lakhs of applicants. Preparation requires 1-2 years of focused study. Coaching and consistent practice are crucial for success. Top colleges: AIIMS, CMC Vellore, JIPMER, State medical colleges.",
  
  exam_upsc: "UPSC (Union Public Service Commission) conducts the Civil Services Examination for IAS, IPS, and IFS positions. It has three stages: Prelims, Mains, and Interview. Syllabus is vast covering history, geography, polity, economics, and current affairs. Preparation typically takes 1-2 years with strong current affairs knowledge essential. Success rate: 0.1-0.2% due to high competition.",
  
  exam_cat: "CAT (Common Admission Test) is for MBA admission in top business schools. It tests quantitative ability, data interpretation, and verbal reasoning. Preparation takes 3-6 months. Success opens doors to high-paying management careers. Mock tests and time management are critical. Top colleges: IIM Ahmedabad, IIM Bangalore, IIM Calcutta, XLRI, ISB.",
  
  // Skill-related responses
  skill_technical: "Technical skills include programming (Python, Java, C++), web development, data analysis, cloud computing, and cybersecurity. These are in high demand across industries. Learning platforms like Coursera, Udemy, and CodeAcademy offer courses. Hands-on projects and certifications enhance employability. Popular certifications: AWS, Google Cloud, Microsoft Azure, Kubernetes.",
  
  skill_soft: "Soft skills include communication, leadership, teamwork, problem-solving, and time management. These are crucial for career success and are valued by all employers. Development comes through practice, workshops, and real-world experience. They complement technical skills for holistic growth. Importance: 85% of career success depends on soft skills.",
  
  skill_communication: "Communication skills involve clear expression, active listening, and effective presentation. These are essential in every career. Improvement comes through practice, public speaking clubs, writing, and feedback. Strong communication leads to better opportunities and career advancement. Methods: Toastmasters, online courses, mentorship, practice presentations.",
  
  skill_leadership: "Leadership skills include decision-making, team management, motivation, and strategic thinking. These are developed through experience, training, and mentorship. Leaders inspire teams, drive innovation, and achieve organizational goals. Leadership development is crucial for career progression. Development: Leadership programs, mentorship, taking on challenging projects.",
  
  // Salary and growth
  salary_general: "Salaries vary widely based on education, experience, location, industry, and role. Entry-level positions typically offer ₹2-5 lakhs annually. Mid-level roles offer ₹8-15 lakhs. Senior positions offer ₹20+ lakhs. Specialized skills and certifications significantly boost earning potential. Highest paying fields: Finance (₹5-25+ lakhs), IT (₹4-20+ lakhs), Consulting (₹10-30+ lakhs).",
  
  growth_outlook: "Career growth depends on skill development, experience, and market demand. High-growth fields include IT, healthcare, finance, and renewable energy. Continuous learning, networking, and taking on challenging projects accelerate growth. Remote work and freelancing offer additional opportunities. Growth strategies: Certifications, higher education, skill development, job hopping, entrepreneurship.",
  
  // Study tips
  study_tips: "Effective study strategies include: 1) Create a structured schedule, 2) Use active recall and spaced repetition, 3) Practice with previous year papers, 4) Join study groups, 5) Take regular breaks, 6) Stay consistent, 7) Review and revise regularly, 8) Manage stress through exercise and meditation. Time management: 70% study, 20% practice, 10% revision.",
  
  preparation_strategy: "Exam preparation requires: 1) Understanding the syllabus completely, 2) Creating a realistic timeline, 3) Using quality study materials, 4) Regular practice with mock tests, 5) Analyzing mistakes, 6) Staying updated with current affairs, 7) Managing time effectively, 8) Maintaining physical and mental health. Success rate increases with: Consistency, quality coaching, peer support, mental health.",
  
  default: "That's an interesting question! I'm your comprehensive AI Career Mentor with knowledge about careers, colleges, exams, skills, salaries, and educational paths. I can provide detailed information about any career field, college recommendations, exam preparation strategies, skill development, salary expectations, and growth opportunities. What specific topic would you like to explore in detail?"
};

const KEYWORD_MAPPING: Record<string, string> = {
  // College keywords
  'college': 'college_general',
  'university': 'college_general',
  'engineering college': 'college_maharashtra',
  'maharashtra': 'college_maharashtra',
  'mumbai': 'college_maharashtra',
  'pune': 'college_maharashtra',
  'iit': 'college_maharashtra',
  'nit': 'college_maharashtra',
  'coep': 'college_maharashtra',
  'vjti': 'college_maharashtra',
  'medical college': 'college_medical',
  'aiims': 'college_medical',
  'neet college': 'college_medical',
  'best college': 'college_general',
  'top college': 'college_general',
  
  // Career keywords
  'software engineer': 'career_it',
  'programmer': 'career_it',
  'developer': 'career_it',
  'data scientist': 'career_it',
  'cloud': 'career_it',
  'cybersecurity': 'career_it',
  'ai': 'career_it',
  'ml': 'career_it',
  'machine learning': 'career_it',
  'doctor': 'career_healthcare',
  'nurse': 'career_healthcare',
  'medical': 'career_healthcare',
  'healthcare': 'career_healthcare',
  'therapist': 'career_healthcare',
  'pharmacist': 'career_healthcare',
  'banker': 'career_finance',
  'accountant': 'career_finance',
  'finance': 'career_finance',
  'investment': 'career_finance',
  'financial': 'career_finance',
  'engineer': 'career_engineering',
  'civil': 'career_engineering',
  'mechanical': 'career_engineering',
  'electrical': 'career_engineering',
  'teacher': 'career_education',
  'professor': 'career_education',
  'education': 'career_education',
  'consultant': 'career_business',
  'manager': 'career_business',
  'business': 'career_business',
  'entrepreneur': 'career_business',
  'startup': 'career_business',
  
  // Exam keywords
  'jee': 'exam_jee',
  'neet': 'exam_neet',
  'upsc': 'exam_upsc',
  'cat': 'exam_cat',
  'exam': 'exam_general',
  'competitive': 'exam_general',
  'test': 'exam_general',
  'preparation': 'preparation_strategy',
  
  // Skill keywords
  'programming': 'skill_technical',
  'coding': 'skill_technical',
  'python': 'skill_technical',
  'java': 'skill_technical',
  'web development': 'skill_technical',
  'data analysis': 'skill_technical',
  'communication': 'skill_communication',
  'leadership': 'skill_leadership',
  'teamwork': 'skill_soft',
  'soft skills': 'skill_soft',
  'problem solving': 'skill_soft',
  
  // Salary and growth
  'salary': 'salary_general',
  'salary growth': 'salary_general',
  'earning': 'salary_general',
  'growth': 'growth_outlook',
  'career growth': 'growth_outlook',
  
  // Study tips
  'study': 'study_tips',
  'how to study': 'study_tips',
  'study strategy': 'study_tips',
  'learning': 'study_tips',
};

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! 👋 I'm your AI Career Mentor. I have comprehensive knowledge about careers, exams, skills, salaries, and educational paths. Ask me anything - from specific career details to exam preparation strategies, skill development, salary expectations, and more. I'm here to provide A to Z information to help you make informed career decisions!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();
    
    // Check keyword mapping for specific topics
    for (const [keyword, responseKey] of Object.entries(KEYWORD_MAPPING)) {
      if (lowerMessage.includes(keyword)) {
        return COMPREHENSIVE_RESPONSES[responseKey];
      }
    }
    
    // Intelligent fallback for any question
    // Analyze the question and provide relevant guidance
    if (lowerMessage.includes('?')) {
      // It's a question - provide thoughtful guidance
      if (lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why') || lowerMessage.includes('when')) {
        return 'That\'s a great question! While I don\'t have a specific response for this topic, I can help you think through it. Career decisions involve understanding your interests, skills, values, and market opportunities. I specialize in: 1) Career exploration and guidance, 2) College and university recommendations, 3) Exam preparation strategies, 4) Skill development and learning paths, 5) Salary expectations and career growth, 6) Career transitions and changes. Could you rephrase your question to focus on any of these areas? For example, ask about specific careers, colleges, exams, or skills you\'re interested in.';
      }
      return 'That\'s an interesting question! I\'m your comprehensive AI Career Mentor. To give you the best guidance, could you provide more details about what you\'re looking for? Are you interested in: 1) Exploring specific careers, 2) Learning about colleges and universities, 3) Exam preparation, 4) Skill development, 5) Salary and career growth, or 6) Career transitions? Share more details and I\'ll provide comprehensive information!';
    }
    
    // For statements or general topics
    if (lowerMessage.length > 0) {
      return 'That\'s an interesting topic! I\'m your AI Career Mentor with comprehensive knowledge about careers, colleges, exams, skills, and professional development. To provide you with the most relevant information, could you ask a specific question? For example: "Tell me about IT careers", "How do I prepare for JEE?", "What are the top colleges in Maharashtra?", "What skills should I learn?", or "What\'s the salary range for engineers?". Ask me anything career-related and I\'ll provide detailed guidance!';
    }
    
    // Fallback to default comprehensive response
    return COMPREHENSIVE_RESPONSES.default;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const suggestedQuestions = [
    { icon: Briefcase, text: "Tell me about IT careers", category: "career" },
    { icon: BookOpen, text: "How do I prepare for JEE?", category: "exam" },
    { icon: Lightbulb, text: "What technical skills should I learn?", category: "skill" },
    { icon: MessageCircle, text: "What's the salary range for engineers?", category: "salary" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend">
      <Header />

      {/* Hero Section */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-secondary" />
            <span className="font-paragraph text-sm font-semibold text-secondary">AI-POWERED GUIDANCE</span>
          </div>
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">
            AI Career Mentor
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Ask any career-related questions and get instant, comprehensive guidance from our AI mentor. A to Z information about careers, exams, skills, and more.
          </p>
        </motion.div>
      </section>

      {/* Chat Section */}
      <section className="w-full flex-1 bg-background py-8">
        <div className="max-w-[100rem] mx-auto px-6 h-full">
          <div className="bg-white rounded-2xl shadow-lg h-[500px] flex flex-col overflow-hidden">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-6 py-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-background border-2 border-primary/20 text-primary rounded-bl-none'
                      }`}
                    >
                      <p className="font-paragraph text-base leading-relaxed">
                        {message.content}
                      </p>
                      <span className={`font-paragraph text-xs mt-2 block ${
                        message.role === 'user' ? 'text-primary-foreground/70' : 'text-primary/60'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-background border-2 border-primary/20 rounded-2xl rounded-bl-none px-6 py-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="border-t border-primary/10 p-6 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about careers, exams, or skills..."
                  className="flex-1 px-6 py-3 rounded-full border-2 border-primary/20 bg-background text-primary font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base font-semibold rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Questions Section */}
      {messages.length === 1 && (
        <section className="w-full bg-white py-12">
          <div className="max-w-[100rem] mx-auto px-6">
            <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
              Popular Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedQuestions.map((question, index) => {
                const Icon = question.icon;
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setInputValue(question.text);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        form?.dispatchEvent(new Event('submit', { bubbles: true }));
                      }, 0);
                    }}
                    className="p-6 bg-background rounded-xl border-2 border-primary/10 hover:border-primary hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <p className="font-paragraph text-base text-primary font-medium">
                        {question.text}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="w-full bg-background py-16">
        <div className="max-w-[100rem] mx-auto px-6">
          <h2 className="font-heading text-3xl font-bold text-primary mb-12 text-center">
            What Can I Help You With?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, title: "Career Guidance", description: "Explore 50+ careers with detailed information about roles, salaries, and requirements" },
              { icon: BookOpen, title: "Exam Preparation", description: "Learn strategies for JEE, NEET, UPSC, CAT and other competitive exams" },
              { icon: Lightbulb, title: "Skill Development", description: "Discover technical and soft skills needed for your target career" },
              { icon: MessageCircle, title: "Salary & Growth", description: "Get comprehensive information about salary ranges and career growth opportunities" }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-xl border-2 border-primary/10 hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-paragraph text-sm text-primary/70">
                    {feature.description}
                  </p>
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
