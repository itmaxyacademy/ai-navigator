export interface Hotspot {
  id: string;
  x: number; // percentage position X
  y: number; // percentage position Y
  title: string;
  description: string;
  iconName?: string;
  tag?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BankQuestionOption {
  id: string;
  text: string;
}

export interface BankQuestion {
  id: string;
  question: string;
  options: BankQuestionOption[];
  correctOptionId: string;
  explanation: string;
}

export interface ModuleQuestionBank {
  moduleId: number;
  moduleName: string;
  questions: BankQuestion[];
}

export interface QuestionBankDatabase {
  modules: ModuleQuestionBank[];
}

export interface LLMAdvantage {
  title: string;
  description: string;
  icon: string;
}

export interface PromptingTip {
  title: string;
  featureName: string;
  badge: string;
  promptExample: string;
  explanation: string;
  proTip: string;
}

export interface PromptingGuide {
  llmName: string;
  summary: string;
  bestPractices: string[];
  tips: PromptingTip[];
}

export interface ModuleSectionContent {
  overview: {
    tagline: string;
    description: string;
    developer: string;
    releaseYear: string;
    keyAdvantages: LLMAdvantage[];
    bestFor: string[];
    uniqueCapabilities: string[];
  };
  interactiveReplica: {
    llmName: string;
    badgeText: string;
    themeColor: string;
    initialPrompt: string;
    simulatedResponse: string;
    hotspots: Hotspot[];
    specialControls?: {
      type: 'rctf-builder' | 'artifacts' | 'google-apps' | 'perplexity-sources' | 'copilot-styles' | 'meta-imagine' | 'deepseek-reasoning' | 'gemini-notebook-studio' | 'google-flow-studio' | 'leonardo-ai-studio' | 'google-stitch-studio' | 'stable-diffusion-studio' | 'openart-studio' | 'craiyon-studio' | 'elevenlabs-studio' | 'suno-studio' | 'google-ai-studio' | 'treblo-studio' | 'fathom-studio' | 'gemini-gems-studio' | 'mistral-vibe-studio' | 'claude-features-studio' | 'kimi-ai-studio';
      title: string;
      description: string;
    };
  };
  promptingGuide?: PromptingGuide;
  quiz: QuizQuestion[];
}

export interface CourseModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  estimatedMinutes: number;
  content: ModuleSectionContent;
}

export type UserTier = 'free' | 'tier1' | 'tier2';

export interface CapstoneSubmission {
  name: string;
  email: string;
  title: string;
  capstoneUrl: string; // Link URL or text description of the capstone project
  submittedAt: string;
}

export interface UserProgress {
  userTier?: UserTier; // 'free' (Free Trial), 'tier1' (Modul 1-22), 'tier2' (VIP Master Modul 1-29)
  maxAllowedModuleId?: number; // e.g. 3 for free, 22 for tier1, 29 for tier2
  paidTiers?: UserTier[]; // List of owned tiers e.g. ['tier1', 'tier2']
  hasTier1?: boolean;
  hasTier2?: boolean;
  userName?: string;   // Display name from API session
  userEmail?: string;  // Email from API session
  packageName?: string; // e.g. 'Free Plan', 'Tier 1 - AI Practitioner', 'Tier 2 - VIP Master'
  subscriptionExpiredAt?: string | null; // ISO date string or null if no expiry
  completedModules: number[]; // Module IDs
  moduleScores: Record<number, number>; // moduleId -> score out of questions length
  currentModuleId: number;
  activeSection: 'overview' | 'replica' | 'prompting' | 'quiz';
  xp: number;
  streakDays: number;
  unlockedBadges: string[];
  lastCompletedDate?: string;
  dailyXpHistory?: Record<string, number>;
  dailyGoalMinutes?: number; // e.g. 15 minutes default
  dailyMinutesHistory?: Record<string, number>; // dateStr -> minutes learned today
  completedCheckpoints?: string[]; // IDs of mini-quiz checkpoints completed
  moduleRevisits?: Record<number, number>; // moduleId -> count of times revisited/practiced
  certName?: string;
  certEmail?: string;
  certRequested?: boolean;
  capstoneSubmission?: CapstoneSubmission;
}

export interface RCTFState {
  role: string;
  context: string;
  task: string;
  format: string;
}
