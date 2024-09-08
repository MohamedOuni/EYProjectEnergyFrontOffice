import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientResponse } from 'src/app/Model/ClientResponse';
import { ClientResponsesService } from 'src/app/Services/client-responses.service';
import { FormService } from 'src/app/Services/form.service';

@Component({
  selector: 'app-list-responses',
  templateUrl: './list-responses.component.html',
  styleUrls: ['./list-responses.component.css']
})
export class ListResponsesComponent implements OnInit {
  clientResponses: ClientResponse[] = [];
  groupedResponses: ResponseGroup[] = [];
  selectedFile: File | null = null;
  selectedResponseId: string | null = null;
  editForms: { [key: string]: FormGroup } = {};
  isModalOpen = false;
  currentEditingResponse: ClientResponse | null = null;

  constructor(private responseService: ClientResponsesService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loadClientResponses();
  }

  loadClientResponses(): void {
    this.responseService.getClientResponses().subscribe(
      (responses) => {
        this.clientResponses = responses;
        this.groupResponsesByFormId();
      },
      (error) => {
        console.error('Error loading client responses:', error);
      }
    );
  }

  groupResponsesByFormId(): void {
    const grouped = this.clientResponses.reduce((acc, response) => {
      const formId = response.formId;
      if (!acc[formId]) {
        acc[formId] = [];
      }
      acc[formId].push(response);
      return acc;
    }, {} as { [key: string]: ClientResponse[] });
  
    const formIds = Object.keys(grouped);
  
    formIds.forEach(formId => {
      this.responseService.getFormNameById(formId).subscribe(
        (formTitle) => {
          this.groupedResponses.push({
            formId,
            formTitle,
            responses: grouped[formId],
            isOpen: false // Ajout de la propriété isOpen
          });

          // Create edit forms for each response
          grouped[formId].forEach(response => {
            this.editForms[response.responseId] = this.formBuilder.group({
              responseText: new FormControl(response.responseText, Validators.required),
              optionId: new FormControl(response.optionId),
              fileId: new FormControl(response.fileId)
            });
          });
        },
        (error) => {
          console.error(`Error loading form title for form ID ${formId}:`, error.message);
        }
      );
    });
  }

  toggleForm(index: number): void {
    this.groupedResponses[index].isOpen = !this.groupedResponses[index].isOpen;
  }

  onFileSelected(event: any, responseId: string): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedResponseId = responseId;
    }
  }

  updateResponseFile(): void {
    if (this.selectedFile && this.selectedResponseId) {
      this.responseService.updateResponseFile(this.selectedResponseId, this.selectedFile).subscribe(
        () => {
          console.log('File updated successfully');
          this.selectedFile = null;
          this.selectedResponseId = null;
          this.loadClientResponses();
        },
        (error) => {
          console.error('Error updating file:', error);
        }
      );
    }
  }

  getFileName(response: ClientResponse): string {
    return response.fileId ? response.fileId : 'Aucun fichier choisi';
  }

  exportToPdf(): void {
    const companyId = '6661716b0d6bdf5592b19e33'; 
    this.responseService.exportResponsesToPdf(companyId).subscribe(
      (data: Blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = 'responses.pdf';
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        console.error('Error exporting responses to PDF:', error);
      }
    );
  }

  downloadFile(fileId: string): void {
    this.responseService.downloadFile(fileId).subscribe(
      (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = fileId;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  openEditModal(response: ClientResponse): void {
    this.currentEditingResponse = response;
    this.isModalOpen = true;
  }

  closeEditModal(): void {
    this.currentEditingResponse = null;
    this.isModalOpen = false;
  }

  saveResponse(): void {
    if (this.currentEditingResponse) {
      const updatedResponse = this.editForms[this.currentEditingResponse.responseId].value;
  
      this.responseService.updateResponse({ ...this.currentEditingResponse, ...updatedResponse }).subscribe(
        (response) => {
          // Mettre à jour la réponse dans la liste sans créer une nouvelle table
          const formGroupIndex = this.groupedResponses.findIndex(group => group.formId === this.currentEditingResponse!.formId);
          if (formGroupIndex !== -1) {
            const responseIndex = this.groupedResponses[formGroupIndex].responses.findIndex(r => r.responseId === this.currentEditingResponse!.responseId);
            if (responseIndex !== -1) {
              this.groupedResponses[formGroupIndex].responses[responseIndex] = { ...this.groupedResponses[formGroupIndex].responses[responseIndex], ...updatedResponse };
            }
          }
  
          this.closeEditModal();
        },
        (error) => {
          console.error('Error updating response:', error);
        }
      );
    }
  }
  
  
  updateClientResponse(updatedResponse: ClientResponse): void {
    const index = this.clientResponses.findIndex(r => r.responseId === updatedResponse.responseId);
    if (index !== -1) {
      this.clientResponses[index] = updatedResponse;
      this.groupResponsesByFormId();
    }
  }
}

interface ResponseGroup {
  formId: string;
  formTitle: string;
  responses: ClientResponse[];
  isOpen: boolean; // Ajout de la propriété isOpen
}