import { Question } from "./Question";

export interface Option {
  optionId: string;
  text: string;
  subQuestions?: Question[];

  }