import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newrequirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newrequirement.component.html',
  styleUrls: ['./newrequirement.component.css'],
})
export class NewRequirementComponent {

  addrequirementstatus:string='status message';
  status:any;
  
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

  createRequirement() {
    if (!this.item || !this.description || !this.unitCost || !this.level || !this.term || !this.year || !this.schoolAdminId) {
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
      schoolAdmin: { id: this.schoolAdminId },
    };

    this.http.post(this.newRequirementUrl, newRequirement).subscribe({
      next: () => {
        this.addrequirementstatus='Requirement created successfully!';
        this.status='success';
        this.clearForm();
      },
      error: (err) => {
        this.status='error';
        this.addrequirementstatus='Error! Failed to create requirement';
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
    this.schoolAdminId = null;
  }
}
