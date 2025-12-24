/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: examsinformation
 * Interface for ExamsInformation
 */
export interface ExamsInformation {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
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
 * Collection ID: popularcareers
 * Interface for PopularCareers
 */
export interface PopularCareers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  careerName?: string;
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
