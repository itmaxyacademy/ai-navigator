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

export interface UserProgress {
  completedModules: number[]; // Module IDs
  moduleScores: Record<number, number>; // moduleId -> score out of questions length
  currentModuleId: number;
  activeSection: 'overview' | 'replica' | 'prompting' | 'quiz';
  xp: number;
  streakDays: number;
  unlockedBadges: string[];
  lastCompletedDate?: string;
}

export interface RCTFState {
  role: string;
  context: string;
  task: string;
  format: string;
}
