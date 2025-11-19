export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  concerns: string[];
  curiousAbout: string;
  dislikes: string;
  conversationStyle: {
    empathySolution: number; // 0 (empathy) to 1 (solution)
    friendlyFormal: number;  // 0 (friendly) to 1 (formal)
  };
}

export interface RecommendedQuest {
  title: string;
  duration: string;
  type: string;
  icon: string; // emoji
}

export interface Quest extends RecommendedQuest {
  isComplete: boolean;
  feedback?: 'worse' | 'same' | 'better';
}

export interface DiaryEntry {
  id: string;
  date: string;
  text: string;
  mood: number;
  detailedEmotions: string[];
  keywords: string[];
  memo: string;
  emotion: string; // The primary emotion analyzed by AI
  aiResponse?: string;
  quest?: Quest;
}

export interface PsychologicalTestResult {
  id: string;
  testId: string;
  score: number;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
}

export interface Content {
  id: string;
  title: string;
  summary: string;
}

export enum View {
  ONBOARDING = 'ONBOARDING',
  MAIN = 'MAIN',
  MAILBOX = 'MAILBOX',
  ANALYTICS = 'ANALYTICS',
  PSYCH_TESTS = 'PSYCH_TESTS',
  SHOPPING = 'SHOPPING',
}