/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: exampreparationguides
 * Interface for ExamPreparationGuides
 */
export interface ExamPreparationGuides {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  guideTitle?: string;
  /** @wixFieldType text */
  examName?: string;
  /** @wixFieldType text */
  preparationStrategies?: string;
  /** @wixFieldType text */
  studyTips?: string;
  /** @wixFieldType text */
  detailedGuideContent?: string;
  /** @wixFieldType image */
  coverImage?: string;
  /** @wixFieldType text */
  difficultyLevel?: string;
}


/**
 * Collection ID: examsinformation
 * Interface for ExamsInformation
 */
export interface ExamsInformation {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  futureExamDates?: string;
  /** @wixFieldType text */
  examName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType url */
  officialWebsite?: string;
  /** @wixFieldType text */
  eligibilityCriteria?: string;
  /** @wixFieldType date */
  applicationDeadline?: Date | string;
  /** @wixFieldType date */
  examDate?: Date | string;
  /** @wixFieldType number */
  examFee?: number;
  /** @wixFieldType image */
  examLogo?: string;
}


/**
 * Collection ID: examsyllabus
 * Interface for ExamSyllabus
 */
export interface ExamSyllabus {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  examId?: string;
  /** @wixFieldType text */
  subjectName?: string;
  /** @wixFieldType text */
  topicsCovered?: string;
  /** @wixFieldType text */
  detailedContent?: string;
  /** @wixFieldType text */
  syllabusVersion?: string;
  /** @wixFieldType text */
  examBoard?: string;
}


/**
 * Collection ID: examtimetables
 * Interface for ExamTimetables
 */
export interface ExamTimetables {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  examId?: string;
  /** @wixFieldType number */
  weekNumber?: number;
  /** @wixFieldType text */
  dayOfWeek?: string;
  /** @wixFieldType text */
  dailyPlan?: string;
  /** @wixFieldType text */
  topicsToCover?: string;
  /** @wixFieldType number */
  hoursPerDay?: number;
}


/**
 * Collection ID: popularcareers
 * Interface for PopularCareers
 */
export interface PopularCareers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  careerName?: string;
  /** @wixFieldType number */
  annualPackage?: number;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  requiredSkills?: string;
  /** @wixFieldType number */
  averageSalary?: number;
  /** @wixFieldType text */
  educationalRequirements?: string;
  /** @wixFieldType text */
  growthOutlook?: string;
  /** @wixFieldType image */
  careerImage?: string;
}


/**
 * Collection ID: userguidance
 * Interface for UserGuidance
 */
export interface UserGuidance {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType date */
  lastUpdated?: Date | string;
  /** @wixFieldType image */
  illustration?: string;
  /** @wixFieldType url */
  videoTutorialUrl?: string;
}
