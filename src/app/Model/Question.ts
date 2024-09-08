import { Option } from "./Option";
import { TypeQuestion } from "./TypeQuestion";

export interface Question {
  questionId: string;
  text: string;
  typeQuestion: TypeQuestion;
  options?: Option[];
  nextQuestionId?: string; 
  subQuestions?: Question[]; 

  }