import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newschoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newschoolfees.component.html',
  styleUrl: './newschoolfees.component.css'
})
export class NewschoolfeesComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Form properties
  item: string = '';
  description: string = '';
  unitCost: number | null = null;
  quantity: number | null = null;
  level: string = '';
  term: string = '';
  year: string = '';
  schoolAdminId: number = 1; // Set this dynamically as needed

  // Dropdown options
  levels: string[] = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
  terms: string[] = ['Term 1', 'Term 2', 'Term 3'];
  years: string[] = ['2024', '2025', '2026', '2027'];

  // Status messages
  status: string | null = null;
  addschoolfeesstatus: string = '';

  // Function to submit school fees data
  createschoolfees() {
    const schoolFeesData = {
      item: this.item,
      description: this.description,
      unitCost: this.unitCost,
      quantity: this.quantity,
      level: this.level,
      term: this.term,
      year: this.year,
      schoolAdminId: this.schoolAdminId
    };

    this.http.post('YOUR_API_ENDPOINT_HERE', schoolFeesData).subscribe({
      next: () => {
        this.status = 'success';
        this.addschoolfeesstatus = 'School fees created successfully!';
        this.resetForm();
      },
      error: () => {
        this.status = 'error';
        this.addschoolfeesstatus = 'Failed to create school fees!';
      }
    });
  }

  // Reset form fields after successful submission
  private resetForm() {
    this.item = '';
    this.description = '';
    this.unitCost = null;
    this.quantity = null;
    this.level = '';
    this.term = '';
    this.year = '';
  }
}
