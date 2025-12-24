# CMS Setup Guide for Enhanced Exams Section

This guide explains how to populate the new CMS collections with comprehensive exam data.

## New Collections Created

### 1. **Exam Syllabus** (Collection ID: `examsyllabus`)
Stores detailed syllabus information for each exam.

**Fields:**
- `examId` (TEXT) - The ID of the exam from the ExamsInformation collection
- `subjectName` (TEXT) - Name of the subject (e.g., "Physics", "Chemistry", "Mathematics")
- `topicsCovered` (TEXT) - Summary of topics covered in this subject
- `detailedContent` (TEXT) - Comprehensive description of the syllabus content
- `syllabusVersion` (TEXT) - Version number of the syllabus
- `examBoard` (TEXT) - Name of the exam board (e.g., "NTA", "CBSE")

**Example Entry for JEE Main:**
```
examId: [JEE Main exam ID]
subjectName: Physics
topicsCovered: Mechanics, Thermodynamics, Optics, Modern Physics, Waves
detailedContent: "Mechanics: Kinematics, Dynamics, Work-Energy, Rotational Motion, Gravitation, Elasticity, Fluids. Thermodynamics: Heat, Laws of Thermodynamics, Kinetic Theory. Optics: Ray Optics, Wave Optics. Modern Physics: Atomic Structure, Nuclear Physics, Semiconductors."
syllabusVersion: 2024
examBoard: NTA
```

### 2. **Exam Preparation Guides** (Collection ID: `exampreparationguides`)
Contains strategies, tips, and detailed guides for exam preparation.

**Fields:**
- `guideTitle` (TEXT) - Title of the preparation guide
- `examName` (TEXT) - Name of the exam (e.g., "JEE Main", "NEET")
- `preparationStrategies` (TEXT) - Detailed preparation strategies
- `studyTips` (TEXT) - Helpful study tips
- `detailedGuideContent` (TEXT) - Comprehensive guide content
- `coverImage` (IMAGE) - Cover image for the guide
- `difficultyLevel` (TEXT) - Difficulty level (Easy, Medium, Hard)

**Example Entry for JEE Main:**
```
guideTitle: Complete JEE Main Preparation Strategy
examName: JEE Main
preparationStrategies: "1. Understand the exam pattern and syllabus thoroughly. 2. Create a structured study plan covering all topics. 3. Focus on conceptual understanding before solving problems. 4. Practice previous year papers and mock tests regularly. 5. Identify weak areas and focus on them."
studyTips: "1. Study for 6-8 hours daily with proper breaks. 2. Use multiple resources for each topic. 3. Maintain a formula sheet for quick revision. 4. Solve at least 50 problems per topic. 5. Take mock tests every week to assess progress."
detailedGuideContent: "JEE Main is one of the most competitive exams in India. Success requires dedication, smart planning, and consistent effort. Start with NCERT textbooks to build strong fundamentals. Then move to advanced problem-solving books. Practice mock tests to improve speed and accuracy. Analyze your performance regularly and adjust your strategy accordingly."
difficultyLevel: Hard
```

### 3. **Exam Timetables** (Collection ID: `examtimetables`)
Provides detailed study timetables for exam preparation.

**Fields:**
- `examId` (TEXT) - The ID of the exam
- `weekNumber` (NUMBER) - Week number in the preparation schedule
- `dayOfWeek` (TEXT) - Day of the week (Monday, Tuesday, etc.)
- `dailyPlan` (TEXT) - Detailed plan for the day
- `topicsToCover` (TEXT) - Topics to study on this day
- `hoursPerDay` (NUMBER) - Recommended study hours

**Example Entry for JEE Main (Week 1):**
```
examId: [JEE Main exam ID]
weekNumber: 1
dayOfWeek: Monday
dailyPlan: "Morning (2 hrs): Physics - Kinematics basics. Afternoon (2 hrs): Chemistry - Atomic Structure. Evening (2 hrs): Mathematics - Sets and Relations."
topicsToCover: Kinematics, Atomic Structure, Sets and Relations
hoursPerDay: 6

examId: [JEE Main exam ID]
weekNumber: 1
dayOfWeek: Tuesday
dailyPlan: "Morning (2 hrs): Physics - Kinematics problems. Afternoon (2 hrs): Chemistry - Periodic Table. Evening (2 hrs): Mathematics - Functions."
topicsToCover: Kinematics Problems, Periodic Table, Functions
hoursPerDay: 6
```

## Updated Collections

### 1. **Exams Information** (Collection ID: `examsinformation`)
**New Field Added:**
- `futureExamDates` (TEXT) - Comma-separated list of future exam dates

**Example:**
```
futureExamDates: "January 22, 2025, January 29, 2025, February 5, 2025"
```

### 2. **Popular Careers** (Collection ID: `popularcareers`)
**New Field Added:**
- `annualPackage` (NUMBER) - Annual salary package in rupees

**Example:**
```
careerName: Software Engineer
annualPackage: 1200000  (₹12,00,000 per year)

careerName: Data Scientist
annualPackage: 1500000  (₹15,00,000 per year)

careerName: IAS Officer
annualPackage: 1000000  (₹10,00,000 per year)
```

## How to Add Data to CMS

### Step 1: Access the CMS
1. Go to your Wix site dashboard
2. Navigate to the CMS section
3. Select the collection you want to populate

### Step 2: Add Items
1. Click "Add Item" button
2. Fill in all the required fields
3. For images, upload from your computer or use image URLs
4. Click "Save"

### Step 3: Sample Data to Add

#### For JEE Main Exam:

**Syllabus Entries (Add 3 entries - one for each subject):**
1. Physics Syllabus
2. Chemistry Syllabus
3. Mathematics Syllabus

**Preparation Guide Entries (Add 2-3 entries):**
1. JEE Main Complete Preparation Strategy
2. Time Management Tips for JEE Main
3. Mock Test Strategy

**Timetable Entries (Add 7 entries for Week 1):**
1. Monday - Week 1
2. Tuesday - Week 1
3. Wednesday - Week 1
4. Thursday - Week 1
5. Friday - Week 1
6. Saturday - Week 1
7. Sunday - Week 1

## Frontend Features

Once you populate the CMS with data, the following features will be available:

### 1. **Exam List Page** (`/exams`)
- Search and filter exams by category
- View exam cards with key information
- Click "View Details" to see comprehensive information

### 2. **Exam Detail Page** (`/exam/:id`)
- Complete exam information with logo
- Remaining days until exam
- Expandable sections for:
  - **Syllabus & Topics**: All subjects and topics covered
  - **Preparation Strategies & Tips**: Expert strategies and study tips
  - **Preparation Timetable**: Week-by-week study schedule with daily plans
  - **Future Exam Dates**: Upcoming exam dates

### 3. **Career Pages**
- Career cards now display annual package in rupees
- Example: "₹12,00,000 per year"

## Data Entry Tips

1. **Be Specific**: Provide detailed, actionable information
2. **Use Proper Formatting**: Use line breaks and bullet points in text fields
3. **Keep Consistency**: Use the same format for similar entries
4. **Update Regularly**: Keep exam dates and information current
5. **Use Clear Language**: Write in simple, understandable language

## Example Complete Entry for NEET Exam

### Exam Information (ExamsInformation)
```
examName: NEET (National Eligibility cum Entrance Test)
description: National level medical entrance exam for MBBS and BDS admissions
officialWebsite: https://neet.nta.ac.in
eligibilityCriteria: 12th pass with Physics, Chemistry, Biology. Age limit: 17 years minimum
applicationDeadline: March 15, 2025
examDate: May 5, 2025
examFee: 1600
futureExamDates: "May 5, 2025, June 2, 2025, July 7, 2025"
```

### Syllabus Entry (ExamSyllabus)
```
examId: [NEET exam ID]
subjectName: Biology
topicsCovered: Cell Biology, Genetics, Ecology, Human Physiology, Plant Physiology
detailedContent: "Cell Biology: Cell Structure, Cell Division, Photosynthesis, Respiration. Genetics: Mendelian Inheritance, Molecular Genetics, Evolution. Ecology: Ecosystem, Population Ecology, Conservation. Human Physiology: Digestion, Circulation, Respiration, Nervous System. Plant Physiology: Photosynthesis, Respiration, Growth, Reproduction."
syllabusVersion: 2024
examBoard: NTA
```

### Preparation Guide Entry (ExamPreparationGuides)
```
guideTitle: NEET Biology Mastery Guide
examName: NEET
preparationStrategies: "1. Master NCERT textbooks thoroughly. 2. Create concept maps for complex topics. 3. Practice diagrams and labeling. 4. Solve previous year papers. 5. Take regular mock tests."
studyTips: "1. Allocate 4 hours daily for Biology. 2. Use color-coded notes. 3. Watch video lectures for difficult concepts. 4. Join study groups for discussions. 5. Maintain a question bank."
detailedGuideContent: "Biology is the most scoring subject in NEET. Focus on understanding concepts rather than memorization. NCERT is the bible for NEET Biology. Read each chapter carefully, make notes, and solve all questions. Practice diagrams as they appear frequently in the exam."
difficultyLevel: Medium
```

### Timetable Entry (ExamTimetables)
```
examId: [NEET exam ID]
weekNumber: 1
dayOfWeek: Monday
dailyPlan: "Morning (2 hrs): Biology - Cell Structure and Function. Afternoon (2 hrs): Chemistry - Atomic Structure. Evening (2 hrs): Physics - Units and Measurements."
topicsToCover: Cell Structure, Atomic Structure, Units and Measurements
hoursPerDay: 6
```

## Troubleshooting

### Issue: Data not showing on the website
- **Solution**: Ensure the `examId` in syllabus/guides/timetables matches the exam's `_id` in ExamsInformation
- **Solution**: Check that all required fields are filled
- **Solution**: Clear browser cache and refresh the page

### Issue: Images not displaying
- **Solution**: Ensure image URLs are valid and accessible
- **Solution**: Use the Wix image upload feature instead of external URLs

### Issue: Timetable not showing
- **Solution**: Verify that `weekNumber` is a number (not text)
- **Solution**: Ensure `examId` matches the exam you're viewing

## Next Steps

1. Populate the CMS collections with exam data
2. Test the exam detail page by clicking "View Details" on an exam
3. Verify all sections are displaying correctly
4. Update career information with annual package details
5. Monitor and update exam dates regularly

For more information, refer to the Wix CMS documentation or contact support.
