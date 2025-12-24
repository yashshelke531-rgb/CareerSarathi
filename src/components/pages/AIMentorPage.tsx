import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageCircle, Lightbulb, BookOpen, Briefcase, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SAMPLE_RESPONSES: Record<string, string> = {
  career: "Based on your interests and skills, I'd recommend exploring careers in technology, business, or creative fields. Consider taking our Skill Test to get personalized recommendations. What specific aspect of career guidance would you like to explore?",
  syllabus: "To help you with syllabus guidance, could you specify which exam or course you're interested in? We have comprehensive resources for competitive exams like JEE, NEET, UPSC, and many others. You can also check our Exams section for detailed exam-specific guidance.",
  exam: "Great question! Different exams require different preparation strategies. For competitive exams, I recommend: 1) Understanding the exam pattern and syllabus, 2) Creating a study schedule, 3) Regular practice with mock tests, 4) Analyzing your performance. Visit our Exams section for detailed guidance on specific exams.",
  skill: "Developing skills is crucial for career success. I recommend identifying skills relevant to your target career, then practicing them consistently. Our Skill Test can help you identify gaps. Would you like recommendations for specific skills?",
  default: "That's a great question! I'm here to help with career guidance, exam preparation, syllabus information, and skill development. Could you provide more details about what you'd like to know? Feel free to ask about specific exams, careers, or learning paths."
};

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! 👋 I'm your AI Career Mentor. I'm here to help you with career guidance, exam preparation, syllabus information, and any other career-related questions. Feel free to ask me anything!",
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
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('profession')) {
      return SAMPLE_RESPONSES.career;
    } else if (lowerMessage.includes('syllabus') || lowerMessage.includes('curriculum') || lowerMessage.includes('course')) {
      return SAMPLE_RESPONSES.syllabus;
    } else if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('preparation')) {
      return SAMPLE_RESPONSES.exam;
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('develop')) {
      return SAMPLE_RESPONSES.skill;
    }
    return SAMPLE_RESPONSES.default;
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
    { icon: Briefcase, text: "What career should I choose?", category: "career" },
    { icon: BookOpen, text: "How do I prepare for competitive exams?", category: "exam" },
    { icon: Lightbulb, text: "What skills should I develop?", category: "skill" },
    { icon: MessageCircle, text: "Tell me about JEE/NEET syllabus", category: "syllabus" }
  ];

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
            <Sparkles className="w-6 h-6 text-secondary" />
            <span className="font-paragraph text-sm font-semibold text-secondary">AI-POWERED GUIDANCE</span>
          </div>
          <h1 className="font-heading text-6xl font-bold text-primary mb-4">
            AI Career Mentor
          </h1>
          <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
            Ask any career-related questions and get instant, personalized guidance from our AI mentor. Free, unlimited, and always available.
          </p>
        </motion.div>
      </section>

      {/* Chat Section */}
      <section className="w-full flex-1 bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-6 h-full">
          <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col overflow-hidden">
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
              { icon: Briefcase, title: "Career Guidance", description: "Get personalized career recommendations based on your interests and skills" },
              { icon: BookOpen, title: "Exam Preparation", description: "Learn strategies and tips for cracking competitive exams" },
              { icon: Lightbulb, title: "Skill Development", description: "Discover which skills you need to develop for your target career" },
              { icon: MessageCircle, title: "Syllabus Help", description: "Get detailed information about exam syllabi and course structures" }
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
