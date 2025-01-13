import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-newrequirement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './newrequirement.component.html',
  styleUrls: ['./newrequirement.component.css'],
})
export class NewRequirementComponent {

  addrequirementstatus: string = 'status message';
  status: string | null = null;
  quantity: number | null = null;

  newRequirementUrl: string = 'http://localhost:8080/api/requirements';
  item: string = '';
  description: string = '';
  unitCost: number | null = null;
  level: string = '';
  term: number | null = null;
  year: number | null = null;
  schoolAdminId: number | null = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : null;

  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  terms: number[] = [1, 2, 3];
  years: number[] = [2025, 2024];

  private http = inject(HttpClient);
  private router=inject(Router);

  createRequirement() {
    // Check if all fields are filled before making the POST request
    if (!this.item || !this.description || !this.unitCost || !this.level || !this.term || !this.year || !this.quantity || !this.schoolAdminId) {
      alert('Please fill in all the fields.');
      return;
    }

    const newRequirement = {
      item: this.item,
      description: this.description,
      unitCost: this.unitCost,
      level: this.level,
      term: this.term,
      year: this.year,
      quantity: this.quantity, // Include quantity
    };

    // Make the POST request to create the new requirement
    this.http.post(`${this.newRequirementUrl}?schoolAdminId=${this.schoolAdminId}`, newRequirement).subscribe({
      next: () => {
        this.addrequirementstatus = 'Requirement created successfully!';
        this.status = 'success';
       // this.router.navigateByUrl("/requirements");
       console.log(`---------------------------${this.description}`);
       this.clearForm();
      
       //
        // Optionally, clear the form after successful submission
      },
      error: (err) => {
        this.status = 'error';
        this.addrequirementstatus = 'Error! Failed to create requirement';
        console.error('Error creating requirement', err);
      },
    });
  }

  clearForm() {
    this.item = '';
    this.description = '';
    this.unitCost = null;
    this.level = '';
    this.term = null;
    this.year = null;
    this.quantity = null;
    this.schoolAdminId = null;
  }
}
