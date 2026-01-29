// Type definitions for The Mountain v2.0

// ============================================
// USER & PROFILE TYPES
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  sport?: string;
  position?: string;
  level?: string;
  createdAt: string;
  lastActive: string;
}

export interface UserProgress {
  totalPoints: number;
  workoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  completedWorkouts: string[];
  completedMilestones: string[];
  armCareCount: number;
  weeklyWorkouts: number;
  scheduledPitchingDays: string[];
  pitchHistory: { date: string; count: number }[];
  programStartDate: string | null;
  completedExerciseIds: string[];
  dailyPoints: { [date: string]: number };
  trainingPoints: number;
  nutritionPoints: number;
}

// ============================================
// COACH BOT TYPES
// ============================================

export type QuestionType =
  | 'single-select'
  | 'multi-select'
  | 'numeric'
  | 'text';

export interface CoachQuestion {
  id: string;
  question: string;
  coachMessage: string; // What the coach says when asking
  followUpMessage?: string; // Dynamic response based on answer
  type: QuestionType;
  options?: CoachOption[];
  maxSelections?: number; // For multi-select: max number of selections allowed
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  dependsOn?: {
    questionId: string;
    values: string[];
  };
}

export interface CoachOption {
  id: string;
  label: string;
  icon?: string;
  subOptions?: CoachOption[]; // For dynamic options like positions per sport
}

export interface CoachConversation {
  currentStep: number;
  answers: { [questionId: string]: string | string[] | number };
  isComplete: boolean;
  planType: 'training' | 'nutrition';
}

// ============================================
// TRAINING PLAN TYPES (matches existing structure)
// ============================================

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  category: 'warmup' | 'strength' | 'jumps' | 'agility' | 'core' | 'armcare' | 'power' | 'throwing' | 'cardio' | 'flexibility';
  equipment?: string;
  description?: string;
  instructions?: string[];
  videoUrl?: string;
  imageUrl?: string;
  points?: number;
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'speed' | 'recovery' | 'basketball' | 'throwing' | 'rest' | 'cardio' | 'sport-specific';
  duration: number;
  exercises: Exercise[];
  points: number;
  phase: number;
}

export interface Phase {
  id: number;
  name: string;
  startWeek: number;
  endWeek: number;
  goals: string[];
  notes: string[];
  weeklySchedule: DayPlan[];
}

export interface DayPlan {
  dayOfWeek: number;
  workoutType: string;
  workoutId?: string;
}

export interface GeneratedTrainingPlan {
  id: string;
  createdAt: string;
  sport: string;
  position: string;
  level: string;
  goals: string[];
  durationWeeks: number;
  phases: Phase[];
  workouts: { [id: string]: Workout };
  userInputs: { [questionId: string]: any };
}

// ============================================
// NUTRITION PLAN TYPES
// ============================================

export interface NutritionTargets {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  water: number; // liters
}

export interface MealTemplate {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout' | 'post-workout';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  prepTime: number; // minutes
  isQuick: boolean;
}

export interface GeneratedNutritionPlan {
  id: string;
  createdAt: string;
  dailyTargets: NutritionTargets;
  mealTemplates: MealTemplate[];
  preworkoutGuidelines: string;
  postworkoutGuidelines: string;
  restrictions: string[];
  userInputs: { [questionId: string]: any };
}

export interface DailyNutritionLog {
  date: string;
  meals: {
    mealType: string;
    logged: boolean;
    calories?: number;
    protein?: number;
  }[];
  waterIntake: number;
  pointsEarned: number;
}

// ============================================
// TEAM & COMPETITION TYPES
// ============================================

export interface Team {
  id: string;
  name: string;
  inviteCode: string;
  leagueId?: string;
  createdBy: string;
  createdAt: string;
  memberCount: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface League {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
  teamCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  totalPoints: number;
  trainingPoints: number;
  nutritionPoints: number;
  activeDays: number;
  currentStreak: number;
  teamId?: string;
  teamName?: string;
}

export interface TeamLeaderboard {
  teamId: string;
  teamName: string;
  totalPoints: number;
  memberCount: number;
  avgPointsPerMember: number;
  topPerformer: {
    displayName: string;
    points: number;
  };
}

// ============================================
// API & SERVICE TYPES
// ============================================

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export interface LLMResponse {
  success: boolean;
  data?: GeneratedTrainingPlan | GeneratedNutritionPlan;
  error?: string;
  tokensUsed?: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}
