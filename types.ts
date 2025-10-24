export type MessageRole = 'user' | 'model';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface Assessment {
  score: number;
  feedback: string[];
}

export interface TrackStep {
  title: string;
  description: string;
}

export interface OnboardingData {
  welcomeMessage: string;
  trackSteps: TrackStep[];
}

export type ExpenseCategory = 'Moradia' | 'Transporte' | 'Alimentação' | 'Lazer' | 'Saúde' | 'Outros';

export type Feeling = 'Essencial' | 'Importante' | 'Desejo' | 'Dava pra Evitar';

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    feeling: Feeling;
    date: Date;
}