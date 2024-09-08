import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppForm } from 'src/app/Model/AppForm';
import { ClientResponse } from 'src/app/Model/ClientResponse';
import { Question } from 'src/app/Model/Question';
import { TypeQuestion } from 'src/app/Model/TypeQuestion';
import { ClientResponsesService } from 'src/app/Services/client-responses.service';
import { FormService } from 'src/app/Services/form.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  forms: AppForm[] = [];
  currentForm: AppForm | null = null;
  currentQuestionIndex: number = 0;
  clientResponses: ClientResponse[] = [];
  typeQuestion = TypeQuestion;
  currentSubQuestion: Question | null = null;
  subQuestionStack: Question[] = [];
  selectedFile: File | null = null;
  hasResponded: boolean = false;
  unfinalizedResponses: ClientResponse[] = [];
  @ViewChild('textAnswer') textAnswer!: ElementRef<HTMLInputElement>;

  constructor(
    private formService: FormService,
    private responseService: ClientResponsesService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms(): void {
    this.formService.getFormsC().subscribe(
      (forms) => {
        this.forms = forms;
      },
      (error) => {
        console.error('Error loading forms:', error);
      }
    );
  }

  checkIfClientHasResponded(formId: string): void {
    this.responseService.hasClientResponded(formId).subscribe(
      (response) => {
        this.hasResponded = response.hasResponded;
        if (!this.hasResponded) {
          this.currentForm = this.forms.find(f => f.formId === formId) || null;
          this.initializeForm();
        } else {
          this.currentForm = this.forms.find(f => f.formId === formId) || null;
        }
      },
      (error) => {
        console.error('Error checking client responses:', error);
      }
    );
  }

  initializeForm(): void {
    if (this.currentForm) {
      this.loadUnfinalizedResponses();
      this.currentQuestionIndex = 0;
      this.clientResponses = [];
      this.currentSubQuestion = null;
      this.subQuestionStack = [];
    }
  }

  loadUnfinalizedResponses(): void {
    if (this.currentForm) {
      this.responseService.getUnfinalizedResponses(this.currentForm.formId).subscribe(
        (responses) => {
          this.unfinalizedResponses = responses;
          this.loadResponsesIntoForm();
        },
        (error) => {
          console.error('Error loading unfinalized responses:', error);
        }
      );
    }
  }

  loadResponsesIntoForm(): void {
    if (this.unfinalizedResponses.length > 0) {
      this.unfinalizedResponses.forEach(response => {
        this.clientResponses.push(response);
      });
      const lastResponse = this.unfinalizedResponses[this.unfinalizedResponses.length - 1];
      const lastQuestionIndex = this.currentForm?.questions.findIndex(q => q.questionId === lastResponse.questionId);
      if (lastQuestionIndex !== undefined && lastQuestionIndex >= 0) {
        this.currentQuestionIndex = lastQuestionIndex + 1;
      }
    }
  }

  selectForm(form: AppForm | null): void {
    if (form) {
      this.currentForm = form;
      this.checkIfClientHasResponded(form.formId);
    }
  }

  answerQuestion(answer: string, optionId?: string): void {
    if (this.currentForm) {
      const question = this.currentSubQuestion || this.currentForm.questions[this.currentQuestionIndex];
      let existingResponse = this.clientResponses.find(r => r.questionId === question.questionId);
      
      if (existingResponse) {
        existingResponse.responseText = answer;
        existingResponse.optionId = optionId || undefined;
        this.responseService.updateResponse(existingResponse).subscribe(
          () => {
            this.moveToNextQuestion(optionId);
          },
          (error) => {
            console.error('Error updating response:', error);
          }
        );
      } else {
        const response: ClientResponse = {
          responseId: '',
          formId: this.currentForm.formId,
          questionId: question.questionId,
          optionId: optionId || undefined,
          responseText: answer,
          fileId: '',
          questionText: question.text
        };

        if (question.typeQuestion === TypeQuestion.File && this.selectedFile) {
          this.responseService.createResponse(response, this.selectedFile).subscribe(
            () => {
              this.clientResponses.push(response);
              this.moveToNextQuestion(optionId);
            },
            (error) => {
              console.error('Error submitting response:', error);
            }
          );
        } else {
          this.responseService.createResponse(response).subscribe(
            () => {
              this.clientResponses.push(response);
              this.moveToNextQuestion(optionId);
            },
            (error) => {
              console.error('Error submitting response:', error);
            }
          );
        }
      }
    }
  }

  moveToNextQuestion(optionId?: string): void {
    if (this.currentForm) {
      if (this.currentSubQuestion) {
        this.handleSubQuestionNavigation(optionId);
      } else {
        this.handleMainQuestionNavigation(optionId);
      }
      this.checkFormCompletion();
      this.initializeInputFields(); 
    }
  }

  initializeInputFields(): void {
    if (this.textAnswer) {
      this.textAnswer.nativeElement.value = '';
    }
    this.selectedFile = null;
  }

  handleSubQuestionNavigation(optionId?: string): void {
    if (this.currentSubQuestion && this.currentSubQuestion.typeQuestion === TypeQuestion.MultipleChoice) {
      const option = this.currentSubQuestion.options?.find(o => o.optionId === optionId);
      if (option?.subQuestions && option.subQuestions.length > 0) {
        this.subQuestionStack.push(...option.subQuestions);
      }
    }
    if (this.subQuestionStack.length > 0) {
      this.currentSubQuestion = this.subQuestionStack.shift() || null;
    } else {
      this.currentSubQuestion = null;
      this.currentQuestionIndex++;
    }
  }

  handleMainQuestionNavigation(optionId?: string): void {
    const question = this.currentForm?.questions[this.currentQuestionIndex];
    if (question) {
      if (question.typeQuestion === TypeQuestion.Textual) {
        this.currentQuestionIndex++;
      } else if (question.typeQuestion === TypeQuestion.MultipleChoice && optionId) {
        const option = question.options?.find(o => o.optionId === optionId);
        if (option?.subQuestions && option.subQuestions.length > 0) {
          this.subQuestionStack.push(...option.subQuestions);
          this.currentSubQuestion = this.subQuestionStack.shift() || null;
          return;
        } else {
          this.currentQuestionIndex++;
        }
      } else {
        this.currentQuestionIndex++;
      }
    }
  }

  checkFormCompletion(): void {
    if (this.currentForm && this.currentQuestionIndex >= this.currentForm.questions.length) {
      this.responseService.finalizeResponses(this.currentForm.formId).subscribe(
        () => {
          this.router.navigate(['/responses', this.currentForm!.formId]);
        },
        (error) => {
          console.error('Error finalizing responses:', error);
        }
      );
    }
  }

  getProgress(): number {
    if (this.currentForm) {
      return (this.currentQuestionIndex / this.currentForm.questions.length) * 100;
    }
    return 0;
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      if (this.currentSubQuestion) {
        this.subQuestionStack.unshift(this.currentSubQuestion);
        this.currentSubQuestion = this.subQuestionStack.shift() || null;
      }
    } else {
      this.currentForm = null;
    }
  }

  getAnswerForCurrentQuestion(): ClientResponse | undefined {
    const questionId = this.currentSubQuestion ? this.currentSubQuestion.questionId : this.currentForm?.questions[this.currentQuestionIndex].questionId;
    return this.clientResponses.find(response => response.questionId === questionId);
  }

  isOptionSelected(optionId: string): boolean {
    return !!this.clientResponses.find(response => response.optionId === optionId);
  }
}