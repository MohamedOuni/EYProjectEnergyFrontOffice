import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientResponsesService } from 'src/app/Services/client-responses.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  contactForm: FormGroup;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private contactService: ClientResponsesService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.sendContactMessage(this.contactForm.value).subscribe(
        response => {
          this.contactForm.reset();
          console.log('Message sent successfully');
        },
        error => {
          console.error('Error sending message', error);
          this.errorMessage = 'There was an error sending your message. Please try again later.';
        }
      );
    }
  }

  onReset() {
    this.contactForm.reset();
  }
}