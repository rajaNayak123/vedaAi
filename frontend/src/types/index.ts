export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface Question {
  questionNumber: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: Section[];
  answerKey: string[];
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInfo: string;
  fileUrl?: string;
  fileName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  generatedPaper?: GeneratedPaper;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentForm {
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInfo: string;
  file?: File;
}
