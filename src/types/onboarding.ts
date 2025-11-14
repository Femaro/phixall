export interface ArtisanOnboarding {
  userId: string;
  email: string;
  status: 'pending' | 'in-progress' | 'training' | 'under-review' | 'approved' | 'rejected';
  currentStep: number;
  trainingProgress?: TrainingProgressState;
  
  // Step 1: Additional Information
  additionalInfo: {
    fullName: string;
    phoneNumber: string;
    sex: 'male' | 'female' | 'other' | '';
    category: string; // e.g., "Plumbing", "Electrical", "HVAC"
    specificSkill: string; // e.g., "Pipe Installation", "Wiring"
    skillLevel: 'beginner' | 'intermediate' | 'expert' | '';
    yearsOfExperience: number;
    certifications: Array<{
      name: string;
      issuer: string;
      dateIssued: string;
      fileUrl: string;
    }>;
    references: Array<{
      name: string;
      phoneNumber: string;
      relationship: string;
      companyName?: string;
    }>;
    idType: 'national-id' | 'drivers-license' | 'voters-card' | 'passport' | '';
    idNumber: string;
    idFileUrl: string;
    bvn: string;
    address: string;
    city: string;
    state: string;
    completed: boolean;
  };
  
  // Step 2: Training
  training: {
    safetyTraining: {
      completed: boolean;
      assessmentScore: number;
      passedAssessment: boolean;
      completedAt?: Date;
    };
    residentialTraining: {
      completed: boolean;
      assessmentScore: number;
      passedAssessment: boolean;
      completedAt?: Date;
    };
    corporateTraining: {
      completed: boolean;
      assessmentScore: number;
      passedAssessment: boolean;
      completedAt?: Date;
    };
    dashboardTraining: {
      completed: boolean;
      assessmentScore: number;
      passedAssessment: boolean;
      completedAt?: Date;
    };
    allCompleted: boolean;
    allPassed: boolean;
  };
  
  // Application Review
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string[];
  duration: string; // e.g., "15 minutes"
  image?: string;
  assessment: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number; // index of correct option
      explanation?: string;
    }>;
    passingScore: number; // 80%
  };
}

export interface TrainingProgress {
  moduleId: string;
  completed: boolean;
  score: number;
  passed: boolean;
  attempts: number;
  lastAttempt?: Date;
}

export interface TrainingProgressState {
  activeModuleId: string | null;
  currentPage: number;
  takingAssessment: boolean;
}

export const ARTISAN_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Carpentry',
  'Painting',
  'Masonry',
  'Welding',
  'Roofing',
  'Flooring',
  'Tiling',
  'Landscaping',
  'Cleaning',
  'Appliance Repair',
  'Security Systems',
  'Generator Maintenance',
  'Other'
];

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-2 years)', color: 'text-amber-600' },
  { value: 'intermediate', label: 'Intermediate (3-5 years)', color: 'text-blue-600' },
  { value: 'expert', label: 'Expert (5+ years)', color: 'text-green-600' }
];

export const ID_TYPES = [
  { value: 'national-id', label: 'National ID Card' },
  { value: 'drivers-license', label: "Driver's License" },
  { value: 'voters-card', label: "Voter's Card" },
  { value: 'passport', label: 'International Passport' }
];

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];


