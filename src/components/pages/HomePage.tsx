// HPI 1.6-V
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, TrendingUp, BookOpen, Target, ArrowRight, Compass, Brain, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserGuidance } from '@/entities';
import { Image } from '@/components/ui/image';

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// --- Utility Components ---

// Mandatory AnimatedElement for scroll reveals
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`${className || ''} animate-reveal`}>{children}</div>;
};

// Custom Wave Pattern Component (Generative Art based on Inspiration)
const WavePattern = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[40vh] overflow-hidden pointer-events-none z-0 opacity-60">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 400">
        <defs>
          <linearGradient id="wave-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {Array.from({ length: 100 }).map((_, i) => {
          const x = i * 15;
          const height = 100 + Math.sin(i * 0.1) * 50 + Math.sin(i * 0.05) * 100;
          return (
            <motion.rect
              key={i}
              x={x}
              y={400 - height}
              width="2"
              height={height}
              fill="url(#wave-gradient)"
              className="text-primary"
              initial={{ height: 0, y: 400 }}
              animate={{ height: height, y: 400 - height }}
              transition={{ duration: 1.5, delay: i * 0.01, ease: "easeOut" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// --- Main Component ---

export default function HomePage() {
  // --- Data Fidelity: Canonical Data Sources ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Mentor. I can help you explore career paths, understand your strengths, and guide you toward the right professional direction. What would you like to know?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [guidanceItems, setGuidanceItems] = useState<UserGuidance[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll hooks for parallax
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // --- Logic Preservation ---
  useEffect(() => {
    loadGuidance();
  }, []);

  const loadGuidance = async () => {
    const { items } = await BaseCrudService.getAll<UserGuidance>('userguidance');
    setGuidanceItems(items.slice(0, 3));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // College and University Queries
    if (lowerMessage.includes('college') || lowerMessage.includes('university') || lowerMessage.includes('engineering college')) {
      if (lowerMessage.includes('maharashtra') || lowerMessage.includes('mumbai') || lowerMessage.includes('pune')) {
        return 'Top Engineering Colleges in Maharashtra: 1) IIT Bombay - Premier institute for engineering, 2) COEP Pune - Oldest engineering college in Asia, 3) NIT Nagpur - National Institute of Technology, 4) VJTI Mumbai - Veermata Jijabai Technological Institute, 5) MIT Pune - Maharashtra Institute of Technology. These colleges offer excellent placements, strong faculty, and industry connections. Admission is through JEE Main/Advanced. Would you like information about specific branches or placement statistics?';
      }
      if (lowerMessage.includes('medical college')) {
        return 'Top Medical Colleges in India: 1) AIIMS Delhi, Mumbai, Bangalore - Premier government medical institutes, 2) CMC Vellore - Christian Medical College, 3) JIPMER Puducherry - Jawaharlal Institute of Postgraduate Medical Education and Research, 4) King George\'s Medical University Lucknow. Admission is through NEET. For Maharashtra: Seth GS Medical College Mumbai, BJ Medical College Pune. These offer excellent clinical training and research opportunities.';
      }
      return 'College selection depends on your field of interest, entrance exam scores, location preference, and career goals. Top colleges offer better placements, faculty, and networking opportunities. Consider factors like: 1) Accreditation and rankings, 2) Faculty expertise, 3) Placement records, 4) Campus facilities, 5) Alumni network. What field are you interested in - engineering, medical, management, or something else?';
    }

    // Engineering Career Queries
    if (lowerMessage.includes('engineer') || lowerMessage.includes('software') || lowerMessage.includes('developer')) {
      return 'Software engineering is an excellent career choice! It offers strong growth potential, competitive salaries (₹4-20+ lakhs), and diverse opportunities across industries. Key skills include programming languages (Python, JavaScript, Java), problem-solving, and continuous learning. Specializations: Web Development, Mobile Apps, Cloud Computing, AI/ML, DevOps. Top companies: Google, Microsoft, Amazon, TCS, Infosys. Would you like to know about specific specializations or learning paths?';
    }

    // Medical Career Queries
    if (lowerMessage.includes('doctor') || lowerMessage.includes('medical') || lowerMessage.includes('medicine') || lowerMessage.includes('mbbs')) {
      return 'A medical career is highly rewarding and impactful. It requires dedication, strong academic performance (NEET qualification), and excellent interpersonal skills. The path: MBBS (5.5 years) → Specialization (3-5 years). Specializations: Surgery, Pediatrics, Cardiology, Psychiatry, Orthopedics. Salary range: ₹3-30+ lakhs depending on specialization and location. Consider work-life balance, financial investment, and your passion for helping others. Would you like information about specific specializations?';
    }

    // Business and MBA Queries
    if (lowerMessage.includes('business') || lowerMessage.includes('mba') || lowerMessage.includes('management') || lowerMessage.includes('entrepreneur')) {
      return 'Business and management careers offer versatility and leadership opportunities. MBA opens doors to consulting, finance, marketing, and entrepreneurship. Top MBA colleges: IIM Ahmedabad, IIM Bangalore, IIM Calcutta, XLRI, ISB. Admission through CAT. Salary: ₹15-50+ lakhs. Key skills: strategic thinking, communication, analytical abilities, leadership. For entrepreneurship: identify market gaps, validate ideas, secure funding, build teams. What interests you most - corporate management, finance, consulting, or starting your own venture?';
    }

    // Skill Development Queries
    if (lowerMessage.includes('skill') || lowerMessage.includes('strength') || lowerMessage.includes('talent') || lowerMessage.includes('learn')) {
      return 'Understanding your skills is crucial for career planning! Hard skills: programming, data analysis, design, languages. Soft skills: communication, leadership, creativity, teamwork, problem-solving. Development strategies: 1) Online courses (Coursera, Udemy, LinkedIn Learning), 2) Certifications (AWS, Google Cloud, Microsoft), 3) Projects and portfolio building, 4) Internships and real-world experience, 5) Mentorship and networking. What areas do you feel most confident in or want to develop?';
    }

    // Exam Preparation Queries
    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('entrance') || lowerMessage.includes('jee') || lowerMessage.includes('neet') || lowerMessage.includes('upsc') || lowerMessage.includes('cat')) {
      return 'Entrance exams are gateways to career paths: JEE (Engineering) - Physics, Chemistry, Math; NEET (Medical) - Physics, Chemistry, Biology; CAT (MBA) - Quantitative, Verbal, Data Interpretation; UPSC (Civil Services) - History, Geography, Polity, Economics. Preparation tips: 1) Understand syllabus completely, 2) Create study schedule, 3) Practice with mock tests, 4) Analyze mistakes, 5) Stay consistent, 6) Manage stress. Which exam are you preparing for?';
    }

    // Salary and Career Growth Queries
    if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('income') || lowerMessage.includes('earning')) {
      return 'Salary varies by industry, location, experience, and specialization. Entry-level: ₹2-5 lakhs; Mid-level: ₹8-15 lakhs; Senior: ₹20+ lakhs. High-paying fields: IT (₹4-20+ lakhs), Finance (₹5-25+ lakhs), Consulting (₹10-30+ lakhs), Medicine (₹3-30+ lakhs). Growth factors: skills, certifications, experience, location (Bangalore, Mumbai, Delhi pay higher), company reputation. Focus on long-term growth, job satisfaction, and skill development alongside compensation. What field interests you?';
    }

    // Career Change Queries
    if (lowerMessage.includes('change') || lowerMessage.includes('switch') || lowerMessage.includes('transition') || lowerMessage.includes('pivot')) {
      return 'Career transitions are increasingly common and successful! Steps: 1) Identify transferable skills, 2) Gain relevant certifications/education, 3) Network in target field, 4) Start with internships or freelance work, 5) Build portfolio, 6) Apply strategically. Examples: IT to Finance (analytical skills), Engineering to Management (leadership), Teaching to Corporate Training. What field are you considering moving into?';
    }

    // General Career Guidance
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('profession') || lowerMessage.includes('path')) {
      return 'Career planning involves understanding your interests, skills, values, and market opportunities. Process: 1) Self-assessment (strengths, interests, values), 2) Research careers, 3) Explore education paths, 4) Gain experience (internships, projects), 5) Network and seek mentorship, 6) Make informed decisions. I can help with specific careers, educational requirements, salary expectations, skill development, or exam preparation. What aspect interests you most?';
    }

    // Default comprehensive response
    return 'I\'m your AI Career Mentor with comprehensive knowledge about careers, colleges, exams, skills, and professional development. I can help with: 1) Career exploration and guidance, 2) College and university recommendations, 3) Exam preparation strategies, 4) Skill development and learning paths, 5) Salary expectations and career growth, 6) Career transitions and changes. Ask me about specific careers, colleges in your region, exam preparation, or any career-related question!';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gradientstart to-gradientend overflow-x-clip font-paragraph text-primary selection:bg-secondary selection:text-secondary-foreground">
      <style>{`
        .animate-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        /* Custom Scrollbar for Chat */
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 20px;
        }
      `}</style>
      <Header onMentorClick={() => setShowChatModal(true)} />
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-screen flex flex-col justify-center pt-0 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <WavePattern />
        </div>
        
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-white/30 backdrop-blur-sm w-fit"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium tracking-wide uppercase">AI-Powered Career Guidance</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-heading text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-primary"
              >
                Your Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Partner in</span> <br />
                Career Growth
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-paragraph text-xl lg:text-2xl text-primary/70 max-w-2xl leading-relaxed"
              >
                Navigate the complexities of the professional world with intelligent insights, personalized mentorship, and data-driven pathways tailored just for you.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link
                  to="/explore"
                  className="group relative px-8 py-4 bg-primary text-primary-foreground font-heading text-lg rounded-full overflow-hidden transition-all hover:shadow-lg hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Exploring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0 opacity-20"></div>
                </Link>
                
                <a
                  href="#ai-mentor"
                  className="px-8 py-4 border border-primary/20 bg-white/20 backdrop-blur-sm text-primary font-heading text-lg rounded-full hover:bg-white/40 transition-all"
                >
                  Talk to Mentor
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Content - Abstract Visual Representation */}
          <div className="lg:col-span-5 relative h-[60vh] hidden lg:block">
             <motion.div 
               style={{ y: yParallax }}
               className="absolute inset-0 flex items-center justify-center"
             >
                <div className="relative w-full h-full">
                  {/* Floating Cards Composition */}
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-10 right-10 w-64 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 z-20"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-secondary rounded-full">
                        <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold">Growth</h3>
                        <p className="text-xs text-primary/60">+24% Projected</p>
                      </div>
                    </div>
                    <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[75%]"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="absolute bottom-20 left-0 w-72 bg-primary text-primary-foreground p-6 rounded-2xl shadow-2xl z-30"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <Brain className="w-8 h-8 text-secondary" />
                      <h3 className="font-heading text-xl font-bold">AI Analysis</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-primary-foreground">
                      "Based on your skills, Software Engineering aligns 94% with your profile."
                    </p>
                  </motion.div>

                  {/* Decorative Circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>
      {/* --- STATS TICKER SECTION --- */}
      <section className="w-full border-y border-primary/10 bg-white/30 backdrop-blur-sm overflow-hidden py-8">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 lg:gap-16">
            {[
              { icon: BookOpen, label: "Exam Guides", value: "100+" },
              { icon: Compass, label: "Career Paths", value: "500+" },
              { icon: Brain, label: "AI Insights", value: "24/7" },
              { icon: Target, label: "Success Rate", value: "98%" },
            ].map((stat, idx) => (
              <AnimatedElement key={idx} delay={idx * 100} className="flex items-center gap-4 group cursor-default">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-primary/60 uppercase tracking-wider font-medium">{stat.label}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </section>
      {/* --- AI MENTOR SECTION (Sticky/Interactive) --- */}
      <section id="ai-mentor" className="relative w-full py-32 overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Context & Instructions */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
              <AnimatedElement>
                <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                  Intelligent <br />
                  <span className="text-primary/40">Career Guidance</span>
                </h2>
                <p className="font-paragraph text-xl text-primary/70 mb-12 leading-relaxed">
                  Unsure about your next step? Our AI Mentor analyzes market trends, educational requirements, and your personal interests to provide tailored advice instantly.
                </p>

                <div className="space-y-6">
                  {[
                    "Ask about specific career paths",
                    "Compare salary expectations",
                    "Find required entrance exams",
                    "Discover skill gaps"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/40 rounded-xl border border-white/60 backdrop-blur-sm hover:bg-white/60 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="font-medium text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </AnimatedElement>
            </div>

            {/* Right: The Chat Interface */}
            <div className="lg:col-span-7">
              <AnimatedElement delay={200}>
                <div className="relative bg-white rounded-[2rem] shadow-2xl border border-primary/5 overflow-hidden h-[700px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-primary/5 bg-primary/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary/60" />
                      <span className="text-sm font-medium text-primary/60 uppercase tracking-widest">{"CareerSarathii AI v1.0"}</span>
                    </div>
                  </div>

                  {/* Chat Messages Area */}
                  <div className="flex-1 overflow-y-p-8 space-y-6 chat-scroll bg-gradient-to-b from-white to-primary/5">
                    <AnimatePresence initial={false}>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-6 rounded-2xl shadow-sm ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-white border border-primary/10 text-primary rounded-tl-none'
                            }`}
                          >
                            <p className="font-paragraph text-lg leading-relaxed">{message.content}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white border border-primary/10 p-4 rounded-2xl rounded-tl-none shadow-sm">
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-6 bg-white border-t border-primary/5">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about a career path..."
                        className="w-full px-6 py-4 bg-primary/5 rounded-xl font-paragraph text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-primary/40"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="absolute right-2 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </div>
        </div>
      </section>
      {/* --- FEATURED IMAGE BREAK --- */}
      <section className="w-full py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <AnimatedElement className="relative w-full h-[60vh] rounded-[3rem] overflow-hidden">
            <Image
              src="https://static.wixstatic.com/media/50f89d_ff07815644444092ba829ea3cee4242b~mv2.png?originWidth=960&originHeight=512"
              alt="Students planning their career path with guidance"
              className="w-full h-full object-cover"
              width={1920}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-12 lg:p-24">
              <div className="max-w-3xl">
                <h3 className="font-heading text-4xl lg:text-5xl text-white font-bold mb-4">
                  Plan Your Future with Confidence
                </h3>
                <p className="text-white/90 text-xl">
                  Access comprehensive resources and expert tools designed to clarify your path forward.
                </p>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
      {/* --- GUIDANCE GRID SECTION --- */}
      <section className="w-full py-32 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <AnimatedElement>
              <h2 className="font-heading text-5xl lg:text-6xl font-bold text-primary mb-4">
                Curated Guidance
              </h2>
              <p className="font-paragraph text-xl text-primary/60 max-w-xl">
                Expert articles and guides to help you navigate every stage of your educational and professional journey.
              </p>
            </AnimatedElement>
            
            <AnimatedElement delay={100}>
              <Link
                to="/guidance"
                className="group flex items-center gap-2 text-lg font-bold border-b-2 border-primary pb-1 hover:text-primary/70 transition-colors"
              >
                View All Resources <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guidanceItems.map((item, index) => (
              <AnimatedElement key={item._id} delay={index * 150}>
                <Link to="/guidance" className="group block h-full">
                  <article className="h-full bg-white p-8 rounded-3xl border border-primary/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    <div className="mb-6 p-4 bg-secondary/20 w-fit rounded-2xl group-hover:bg-secondary transition-colors duration-300">
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary mb-4 group-hover:text-primary/80 transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-paragraph text-base text-primary/60 mb-8 line-clamp-3 flex-grow leading-relaxed">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary/40 group-hover:text-primary transition-colors">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                  </article>
                </Link>
              </AnimatedElement>
            ))}
            
            {/* Fallback if no items loaded yet */}
            {guidanceItems.length === 0 && (
               <div className="col-span-3 text-center py-12 text-primary/40">
                 Loading guidance resources...
               </div>
            )}
          </div>
        </div>
      </section>
      {/* --- CTA SECTION --- */}
      <section className="w-full py-32 overflow-hidden">
        <div className="max-w-[100rem] mx-auto px-6">
          <AnimatedElement className="relative bg-primary rounded-[3rem] p-12 lg:p-24 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
               </svg>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-8">
                Ready to Shape Your Future?
              </h2>
              <p className="font-paragraph text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed">
                Join thousands of students and professionals who have found their true calling with CareerSati.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/explore"
                  className="px-10 py-5 bg-secondary text-secondary-foreground font-heading text-xl font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-secondary/20"
                >
                  Explore Careers
                </Link>
                <Link
                  to="/signup"
                  className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-heading text-xl font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>
      <Footer />
      {/* AI Mentor Modal - Opens on current view without scrolling */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowChatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-[600px] bg-white rounded-[2rem] shadow-2xl border border-primary/5 overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-primary/5 bg-primary/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary/60" />
                  <span className="text-sm font-medium text-primary/60 uppercase tracking-widest">CareerSati AI v1.0</span>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-primary/60 hover:text-primary transition-colors ml-4"
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 chat-scroll bg-gradient-to-b from-white to-primary/5">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-white border border-primary/10 text-primary rounded-tl-none'
                        }`}
                      >
                        <p className="font-paragraph text-base leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-primary/10 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-primary/5">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about a career path..."
                    className="w-full px-4 py-3 bg-primary/5 rounded-xl font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-primary/40"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}