// Skill Test Questions for Career Interest Assessment
export interface SkillTestQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    careerCategories: string[];
  }[];
}

export const skillTestQuestions: SkillTestQuestion[] = [
  {
    id: 1,
    question: "Which type of work environment appeals to you the most?",
    options: [
      { text: "Fast-paced, dynamic, and constantly changing", careerCategories: ["Technology", "Finance", "Business"] },
      { text: "Structured, organized, and predictable", careerCategories: ["Engineering", "Government", "Education"] },
      { text: "Creative, flexible, and self-directed", careerCategories: ["Creative", "Design", "Arts"] },
      { text: "Helping people and making a difference", careerCategories: ["Healthcare", "Social Work", "Education"] },
      { text: "Solving complex problems and analyzing data", careerCategories: ["Technology", "Science", "Finance"] }
    ]
  },
  {
    id: 2,
    question: "What are your strongest skills?",
    options: [
      { text: "Communication and interpersonal skills", careerCategories: ["Business", "Healthcare", "Education", "Sales"] },
      { text: "Technical and programming skills", careerCategories: ["Technology", "Engineering", "IT"] },
      { text: "Creative and artistic abilities", careerCategories: ["Creative", "Design", "Arts", "Media"] },
      { text: "Analytical and mathematical thinking", careerCategories: ["Finance", "Science", "Engineering", "Technology"] },
      { text: "Leadership and decision-making", careerCategories: ["Business", "Management", "Government"] }
    ]
  },
  {
    id: 3,
    question: "What motivates you the most in a career?",
    options: [
      { text: "High salary and financial rewards", careerCategories: ["Finance", "Technology", "Business", "Law"] },
      { text: "Job security and stability", careerCategories: ["Government", "Education", "Healthcare", "Banking"] },
      { text: "Making a positive impact on society", careerCategories: ["Healthcare", "Social Work", "Education", "Environment"] },
      { text: "Creative expression and innovation", careerCategories: ["Creative", "Design", "Arts", "Technology"] },
      { text: "Learning and personal growth", careerCategories: ["Education", "Research", "Science", "Technology"] }
    ]
  },
  {
    id: 4,
    question: "How do you prefer to spend your time?",
    options: [
      { text: "Working with people and building relationships", careerCategories: ["Business", "Healthcare", "Education", "Sales"] },
      { text: "Working with computers and technology", careerCategories: ["Technology", "IT", "Engineering"] },
      { text: "Creating and designing things", careerCategories: ["Creative", "Design", "Arts", "Architecture"] },
      { text: "Analyzing data and solving problems", careerCategories: ["Finance", "Science", "Technology", "Engineering"] },
      { text: "Helping others and providing care", careerCategories: ["Healthcare", "Social Work", "Education", "Counseling"] }
    ]
  },
  {
    id: 5,
    question: "What type of education appeals to you?",
    options: [
      { text: "Hands-on, practical training and apprenticeships", careerCategories: ["Trades", "Engineering", "Healthcare"] },
      { text: "Bachelor's degree in a specific field", careerCategories: ["Business", "Technology", "Engineering", "Education"] },
      { text: "Advanced degree (Master's or PhD)", careerCategories: ["Research", "Science", "Education", "Law"] },
      { text: "Online courses and self-learning", careerCategories: ["Technology", "Creative", "Freelance"] },
      { text: "Professional certifications and licenses", careerCategories: ["Finance", "Healthcare", "Law", "IT"] }
    ]
  },
  {
    id: 6,
    question: "How important is work-life balance to you?",
    options: [
      { text: "Very important - I want flexible hours", careerCategories: ["Creative", "Freelance", "Education", "Consulting"] },
      { text: "Important - I want reasonable working hours", careerCategories: ["Government", "Education", "Healthcare", "Business"] },
      { text: "Less important - I'm willing to work long hours for success", careerCategories: ["Finance", "Technology", "Business", "Law"] },
      { text: "I prefer a structured 9-5 schedule", careerCategories: ["Government", "Banking", "Education", "Administration"] },
      { text: "I want to work on my own terms", careerCategories: ["Entrepreneurship", "Freelance", "Creative"] }
    ]
  },
  {
    id: 7,
    question: "What type of problems do you enjoy solving?",
    options: [
      { text: "People and relationship problems", careerCategories: ["Healthcare", "Social Work", "Counseling", "HR"] },
      { text: "Technical and technological problems", careerCategories: ["Technology", "Engineering", "IT"] },
      { text: "Business and financial problems", careerCategories: ["Finance", "Business", "Consulting", "Accounting"] },
      { text: "Creative and design challenges", careerCategories: ["Creative", "Design", "Arts", "Architecture"] },
      { text: "Scientific and research problems", careerCategories: ["Science", "Research", "Engineering", "Medicine"] }
    ]
  },
  {
    id: 8,
    question: "How do you feel about travel and relocation?",
    options: [
      { text: "I love traveling and would relocate for opportunities", careerCategories: ["Consulting", "Diplomacy", "Sales", "Hospitality"] },
      { text: "I'm open to occasional travel", careerCategories: ["Business", "Technology", "Engineering", "Sales"] },
      { text: "I prefer to stay in one location", careerCategories: ["Government", "Education", "Healthcare", "Local Business"] },
      { text: "I want to work remotely from anywhere", careerCategories: ["Technology", "Creative", "Freelance", "Consulting"] },
      { text: "Travel is not a concern for me", careerCategories: ["All"] }
    ]
  },
  {
    id: 9,
    question: "What's your preferred work style?",
    options: [
      { text: "Independent work with minimal supervision", careerCategories: ["Freelance", "Entrepreneurship", "Creative", "Research"] },
      { text: "Collaborative team environment", careerCategories: ["Technology", "Business", "Engineering", "Healthcare"] },
      { text: "Leadership and managing others", careerCategories: ["Business", "Management", "Government", "Education"] },
      { text: "Mentoring and teaching others", careerCategories: ["Education", "Healthcare", "Consulting", "Training"] },
      { text: "Structured hierarchy and clear roles", careerCategories: ["Government", "Military", "Banking", "Healthcare"] }
    ]
  },
  {
    id: 10,
    question: "How do you handle stress and pressure?",
    options: [
      { text: "I thrive under pressure and tight deadlines", careerCategories: ["Finance", "Law", "Business", "Emergency Services"] },
      { text: "I prefer a calm and steady work environment", careerCategories: ["Education", "Research", "Government", "Library"] },
      { text: "I like moderate challenges with achievable goals", careerCategories: ["Engineering", "Technology", "Healthcare", "Business"] },
      { text: "I need flexibility to manage stress", careerCategories: ["Creative", "Freelance", "Consulting", "Education"] },
      { text: "I'm adaptable to any pressure level", careerCategories: ["All"] }
    ]
  },
  {
    id: 11,
    question: "What role do you want to play in your organization?",
    options: [
      { text: "Executive/Leadership position", careerCategories: ["Business", "Management", "Government", "Finance"] },
      { text: "Specialist/Expert in my field", careerCategories: ["Technology", "Engineering", "Healthcare", "Science"] },
      { text: "Team player contributing to group success", careerCategories: ["Technology", "Business", "Engineering", "Healthcare"] },
      { text: "Independent contributor/Freelancer", careerCategories: ["Creative", "Freelance", "Consulting", "Technology"] },
      { text: "Mentor and knowledge sharer", careerCategories: ["Education", "Healthcare", "Consulting", "Training"] }
    ]
  },
  {
    id: 12,
    question: "How important is innovation and staying current?",
    options: [
      { text: "Very important - I love learning new things", careerCategories: ["Technology", "Science", "Research", "Creative"] },
      { text: "Important - I want to stay competitive", careerCategories: ["Technology", "Business", "Finance", "Engineering"] },
      { text: "Somewhat important - I adapt as needed", careerCategories: ["Healthcare", "Education", "Business", "Government"] },
      { text: "Not very important - I prefer proven methods", careerCategories: ["Government", "Education", "Trades", "Banking"] },
      { text: "I'm indifferent about innovation", careerCategories: ["All"] }
    ]
  },
  {
    id: 13,
    question: "What's your ideal company size to work for?",
    options: [
      { text: "Large corporation with stability and benefits", careerCategories: ["Business", "Technology", "Finance", "Healthcare"] },
      { text: "Small startup with growth potential", careerCategories: ["Technology", "Entrepreneurship", "Creative", "Business"] },
      { text: "Government or public sector", careerCategories: ["Government", "Education", "Healthcare", "Law"] },
      { text: "Non-profit or social enterprise", careerCategories: ["Social Work", "Healthcare", "Education", "Environment"] },
      { text: "Self-employed or freelancer", careerCategories: ["Creative", "Freelance", "Consulting", "Entrepreneurship"] }
    ]
  },
  {
    id: 14,
    question: "How do you feel about continuous education and certifications?",
    options: [
      { text: "I love pursuing certifications and advanced degrees", careerCategories: ["Healthcare", "Law", "Finance", "Education"] },
      { text: "I'm willing to pursue relevant certifications", careerCategories: ["Technology", "Finance", "Engineering", "IT"] },
      { text: "I prefer on-the-job learning", careerCategories: ["Business", "Trades", "Creative", "Sales"] },
      { text: "I want minimal formal education requirements", careerCategories: ["Trades", "Entrepreneurship", "Creative", "Sales"] },
      { text: "I'm flexible about education requirements", careerCategories: ["All"] }
    ]
  },
  {
    id: 15,
    question: "What's your ultimate career goal?",
    options: [
      { text: "Become a leader/executive in my field", careerCategories: ["Business", "Management", "Government", "Finance"] },
      { text: "Become an expert/specialist in my field", careerCategories: ["Technology", "Engineering", "Healthcare", "Science"] },
      { text: "Start my own business/venture", careerCategories: ["Entrepreneurship", "Creative", "Technology", "Business"] },
      { text: "Make a positive impact on society", careerCategories: ["Healthcare", "Social Work", "Education", "Environment"] },
      { text: "Achieve financial independence", careerCategories: ["Finance", "Technology", "Business", "Entrepreneurship"] }
    ]
  }
];

// Career category to career mapping
export const careerCategoryMapping: Record<string, string[]> = {
  "Technology": ["Software Engineer", "Data Scientist", "DevOps Engineer", "Cloud Architect", "AI/ML Engineer", "Mobile App Developer", "Full Stack Developer", "Database Administrator", "Systems Administrator", "Network Engineer", "IT Support Specialist", "Cybersecurity Analyst"],
  "Finance": ["Accountant", "Financial Analyst", "Investment Banker", "Stock Broker", "Tax Consultant", "Loan Officer", "Credit Analyst", "Actuary"],
  "Business": ["Product Manager", "Project Manager", "Business Analyst", "HR Manager", "Marketing Manager", "Sales Manager", "Operations Manager", "Management Consultant", "Entrepreneur", "Consultant"],
  "Healthcare": ["Doctor", "Surgeon", "Nurse", "Pharmacist", "Dentist", "Psychologist", "Physiotherapist", "Radiologist", "Cardiologist", "Pediatrician", "Dermatologist", "Orthopedic Surgeon"],
  "Engineering": ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer", "Environmental Engineer", "Aerospace Engineer", "Biomedical Engineer"],
  "Education": ["Teacher", "University Professor", "School Principal", "Counselor"],
  "Creative": ["Graphic Designer", "Video Producer", "Photographer", "Music Producer", "Actor", "Art Director", "Fashion Designer", "Interior Designer", "Landscape Architect", "Industrial Designer", "Copywriter"],
  "Government": ["Police Officer", "Military Officer", "Government Administrator", "Diplomat"],
  "Law": ["Lawyer", "Judge"],
  "Science": ["Scientist", "Geologist", "Meteorologist", "Astronomer", "Biologist", "Chemist", "Physicist", "Mathematician", "Statistician", "Economist"],
  "Social Work": ["Social Worker", "Counselor"],
  "Hospitality": ["Chef", "Hotel Manager", "Tour Guide", "Event Manager"],
  "Trades": ["Electrician", "Plumber", "Carpenter", "Welder", "Mechanic"],
  "Other": ["Farmer", "Veterinarian", "Nutritionist", "Fitness Trainer", "Sports Manager", "Pilot", "Air Traffic Controller", "Journalist", "Content Writer", "Technical Writer", "Public Relations Manager", "Digital Marketing Specialist", "Social Media Manager", "Brand Manager", "Supply Chain Manager", "Procurement Manager", "Quality Assurance Manager", "Compliance Officer", "Risk Manager", "Auditor", "Venture Capitalist", "Freelancer", "Librarian", "Museum Curator", "Urban Planner", "Environmental Scientist", "Translator", "Interpreter"],
  "Consulting": ["Management Consultant", "Consultant", "Freelancer"],
  "Entrepreneurship": ["Entrepreneur", "Venture Capitalist"],
  "Freelance": ["Freelancer", "Content Writer", "Graphic Designer", "Video Producer", "Photographer", "Copywriter"],
  "Design": ["Graphic Designer", "UX/UI Designer", "Art Director", "Fashion Designer", "Interior Designer", "Landscape Architect", "Industrial Designer"],
  "Arts": ["Actor", "Music Producer", "Photographer", "Graphic Designer"],
  "Media": ["Video Producer", "Journalist", "Content Writer", "Photographer"],
  "Research": ["Scientist", "University Professor", "Biologist", "Chemist", "Physicist", "Mathematician"],
  "Sales": ["Sales Manager", "Stock Broker", "Insurance Agent", "Real Estate Agent"],
  "Banking": ["Accountant", "Financial Analyst", "Loan Officer", "Credit Analyst"],
  "Accounting": ["Accountant", "Auditor", "Tax Consultant"],
  "HR": ["HR Manager", "Social Worker"],
  "Training": ["Teacher", "University Professor", "Counselor"],
  "Counseling": ["Psychologist", "Counselor", "Social Worker"],
  "Environment": ["Environmental Engineer", "Environmental Scientist", "Geologist"],
  "Administration": ["Government Administrator", "Project Manager", "Operations Manager"],
  "Management": ["Project Manager", "Operations Manager", "HR Manager", "Sales Manager", "Hotel Manager"],
  "Emergency Services": ["Police Officer", "Military Officer"],
  "Library": ["Librarian"],
  "All": []
};
