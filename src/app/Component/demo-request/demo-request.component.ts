import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemoRequestService } from 'src/app/Services/DemoRequest/demo-request.service';

@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.component.html',
  styleUrls: ['./demo-request.component.css']
})
export class DemoRequestComponent {
  demoForm: FormGroup;
  evaluation: string = '';
  showDemoRequest: boolean = false;
  showSignupRedirect: boolean = false; // Nouveau drapeau pour afficher le message de redirection
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private demoRequestService: DemoRequestService,
    private router: Router // Injecter le routeur pour la redirection
  ) {
    this.demoForm = this.fb.group({
      visitorName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      buildingSurface: ['', Validators.required],
      annualPayment: ['', Validators.required],
      selectedDate: ['', Validators.required]
    });
  }

  calculateEvaluation() {
    const surface = this.demoForm.get('buildingSurface')?.value;
    const payment = this.demoForm.get('annualPayment')?.value;

    const averageConsumption = 200; 
    const energyCostPerKWh = 0.15; 

    const theoreticalConsumption = surface * averageConsumption;
    const theoreticalCost = theoreticalConsumption * energyCostPerKWh;

    if (payment <= 0.9 * theoreticalCost) {
      this.evaluation = 'Parfaite';
      this.message = 'Votre consommation énergétique est parfaite! Vous pouvez continuer avec notre service ou demander un démo pour en savoir plus.';
    } else if (payment <= 1.1 * theoreticalCost) {
      this.evaluation = 'Bonne';
      this.message = 'Votre consommation énergétique est bonne, mais il y a une marge d\'amélioration. Nous vous recommandons de travailler avec nous pour optimiser vos coûts.';
    } else {
      this.evaluation = 'Faible';
      this.message = 'Votre consommation énergétique est faible, ce qui signifie que vous pourriez bénéficier grandement de nos services pour économiser de l\'énergie.';
    }

    this.showDemoRequest = true;
  }

  submitDemoRequest() {
    if (this.demoForm.valid) {
      const demoRequest = {
        ...this.demoForm.value,
        evaluation: this.evaluation
      };

      this.demoRequestService.createDemoRequest(demoRequest)
        .subscribe(response => {
          this.showSignupRedirect = true; // Afficher le message de redirection après soumission
        });
    }
  }

  redirectToSignup() {
    this.router.navigate(['/signup']); // Rediriger vers la page d'inscription
  }
}