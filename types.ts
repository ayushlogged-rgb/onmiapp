export enum ToolCategory {
  PRODUCTIVITY = 'Productivity',
  FINANCE = 'Finance',
  UTILITIES = 'Utilities',
  AI = 'AI Tools'
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  isTodo: boolean;
  completed?: boolean;
}

export interface MathQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  durationMinutes: number;
  date: string;
  calories?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}