export interface Question {
  id: string;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  objective: string;
  theory: string[];
  examples: {
    problem: string;
    solution: string[];
  }[];
  quizzes: Question[];
}

export interface Chapter {
  id: string;
  title: string;
  bookVolume: 1 | 2;
  lessons: Lesson[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
