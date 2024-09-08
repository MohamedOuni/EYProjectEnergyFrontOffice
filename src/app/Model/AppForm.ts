import { Question } from "./Question";

export interface AppForm {
    formId: string;
    title: string;
    questions: Question[];
  }