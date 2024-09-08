export interface ClientResponse {
    responseId: string;
    formId: string;
    questionId: string;
    optionId?: string;
    responseText: string;
    fileId?: string;
    questionText?: string; 
  }