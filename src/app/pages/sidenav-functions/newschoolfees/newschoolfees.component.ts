import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newschoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newschoolfees.component.html',
  styleUrl: './newschoolfees.component.css'
})
export class NewschoolfeesComponent {
  private http = inject(HttpClient);
  myyear: number = new Date().getFullYear(); 
  mylevel: string = localStorage.getItem('level') ?? ''; 
  myterm: number = 1; 
  step: number = 1; // Track the current step
  isAddingDetail: boolean = false; // Flag to check if new detail input is shown
  currentDetail: any = { item: '', description: '', amount: 0 }; // Temporary object for adding a new detail
  editingIndex: number | undefined;
  schoolAdminId: number | null = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : null;

  years: number[] = [];
  terms: number[] = [1, 2, 3];
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  schoolFeesSetting: any = { total: 0 }; // To hold the total school fees
  schoolFeesDetails: any[] = []; // To hold the fee details

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

 
  

  addDetail(): void {
    // Show the input fields to add a new detail
    this.isAddingDetail = true;
  }

  cancelAddDetail(): void {
    // Cancel the addition of a detail and hide the input fields
    this.isAddingDetail = false;
  }

  editDetail(index: number): void {
    const detailToEdit = this.schoolFeesDetails[index];
    this.currentDetail = { ...detailToEdit }; // Copy the detail to currentDetail for editing
    this.isAddingDetail = true; // Show the input fields for editing
    this.editingIndex = index; // Track the index of the item being edited
  }

  addToList(detail: any): void {
    if (detail.item && detail.description && detail.amount) {
      if (this.editingIndex !== undefined) {
        // If we are editing, update the existing item
        this.schoolFeesDetails[this.editingIndex] = { ...detail };
        this.editingIndex = undefined; // Reset the editing index
      } else {
        // If adding a new item, push to the list
        this.schoolFeesDetails.push({ ...detail });
      }
      this.calculateTotal();
      this.cancelAddDetail(); // Hide the input fields after adding or updating the detail
    } else {
      alert('Please fill all fields!');
    }
  }

  removeDetail(index: number): void {
    // Remove the item from the list
    this.schoolFeesDetails.splice(index, 1);
    this.calculateTotal(); // Recalculate total after removal
  }

  calculateTotal(): void {
    this.schoolFeesSetting.total = this.schoolFeesDetails.reduce((sum, detail) => sum + (detail.amount || 0), 0);
  }

  createschoolfees(): void {
    const schoolAdminId = localStorage.getItem('id');
    if (!schoolAdminId) {
      alert('School Admin ID is missing.');
      return;
    }
  
    // Check if all required fields are selected
    if (!this.myyear || !this.myterm || !this.mylevel) {
      // Determine which field is missing and show an alert
      let missingItem = '';
      if (!this.myyear) missingItem = 'Year';
      else if (!this.myterm) missingItem = 'Term';
      else if (!this.mylevel) missingItem = 'Class';
  
      // Show SweetAlert for missing selection
      Swal.fire({
        icon: 'warning',
        title: 'Missing Selection',
        text: `Please select ${missingItem}!`,
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const schoolFeesSetting = {
      year: this.myyear.toString(),
      term: this.myterm.toString(),
      level: this.mylevel,
      total: 0,
      reason: 'schoolfees',
      schoolAdmin: { id: Number(schoolAdminId) }
    };
  
    this.http.post<any>('http://localhost:8080/api/school-fees-settings', schoolFeesSetting)
      .subscribe({
        next: (response) => {
          if (response && response.id) {
            localStorage.setItem('schoolFeesSettingId', response.id.toString());
            this.step = 2; // Move to next step
          } else {
            alert('Failed to retrieve ID from response.');
          }
        },
        error: (error) => {
          console.error('Error creating school fees setting:', error);
          alert('An error occurred while setting school fees.');
        }
      });
  }

  saveFees(): void {
    const schoolFeesSettingId = localStorage.getItem('schoolFeesSettingId');
    if (!schoolFeesSettingId) {
      alert('School Fees Setting ID is missing.');
      return;
    }

    // Assign the school fees setting ID to each detail
    this.schoolFeesDetails.forEach(detail => {
      detail.schoolFeesSetting = { id: Number(schoolFeesSettingId) };
    });

    // Save the details to the API
    this.http.post<any>('http://localhost:8080/api/school-fees-details', this.schoolFeesDetails)
      .subscribe({
        next: (response) => {
          alert('Fees saved successfully!');
        },
        error: (error) => {
          console.error('Error saving fees:', error);
          alert('An error occurred while saving fees.');
        }
      });
  }
  
  cancel(): void {
    // Clear the details and reset step to 1
    this.schoolFeesDetails = [];
    this.step = 1;
  }
}