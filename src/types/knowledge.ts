export type KnowledgeRecord = {
  id: string;
  category: string;
  title: string;
  question: string;
  keywords: string[];
  answer: string;
  bullets?: string[];
  nextStep: string;
  source: string;
  details: {
    label: string;
    content: string;
  }[];
};
