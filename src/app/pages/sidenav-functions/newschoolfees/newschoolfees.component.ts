import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  deletedDetails: number[] = []; // Stores IDs of deleted details
  accountType:any=localStorage.getItem('Role')||null;

  router=inject(Router);
  ngOnInit() {
    
    if(this.accountType!='ROLE_ADMIN'){
      this.router.navigate(['/']);
    }
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

 

  calculateTotal(): void {
    this.schoolFeesSetting.total = this.schoolFeesDetails.reduce((sum, detail) => sum + (detail.amount || 0), 0);
  }

  createschoolfees(): void {
    const schoolAdminId = localStorage.getItem('id');
    if (!schoolAdminId) {
      Swal.fire({
        icon: 'error',
        title: 'Missing School Admin ID',
        text: 'School Admin ID is required.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (!this.myyear || !this.myterm || !this.mylevel) {
      let missingItem = !this.myyear ? 'Year' : !this.myterm ? 'Term' : 'Class';
      Swal.fire({
        icon: 'warning',
        title: 'Missing Selection',
        text: `Please select ${missingItem}!`,
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Step 1: Check if entry already exists
    this.http.get<number>(`http://localhost:8080/api/school-fees-settings/find?year=${this.myyear}&term=${this.myterm}&level=${this.mylevel}`)
      .subscribe({
        next: (existingId) => {
          if (existingId) {
            Swal.fire({
              icon: 'info',
              title: 'Entry Exists',
              text: `An entry already exists with ID: ${existingId}`,
              showCancelButton: true,
              confirmButtonText: 'Edit Details',
              cancelButtonText: 'Cancel'
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem('schoolFeesSettingId', existingId.toString());
                this.step = 2;
                this.fetchSchoolFeesDetails(existingId); // Fetch the details
              }
            });
          } else {
            this.createNewSchoolFeesEntry();
          }
        },
        error: (error) => {
          console.error('Error checking existing entry:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while checking for existing entries.',
            confirmButtonText: 'OK'
          });
        }
      });
  }
  
  
  // Function to create new school fees entry
  private createNewSchoolFeesEntry(): void {
    const schoolAdminId = Number(localStorage.getItem('id'));
    const schoolFeesSetting = {
      year: this.myyear.toString(),
      term: this.myterm.toString(),
      level: this.mylevel,
      total: 0,
      reason: 'schoolfees',
      schoolAdmin: { id: schoolAdminId }
    };
  
    this.http.post<any>('http://localhost:8080/api/school-fees-settings', schoolFeesSetting)
      .subscribe({
        next: (response) => {
          if (response && response.id) {
            localStorage.setItem('schoolFeesSettingId', response.id.toString());
            this.step = 2; // Move to next step
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Failed to retrieve ID from response.',
              confirmButtonText: 'OK'
            });
          }
        },
        error: (error) => {
          console.error('Error creating school fees setting:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while setting school fees.',
            confirmButtonText: 'OK'
          });
        }
      });
  }

  fetchSchoolFeesDetails(feesId: number): void {
    this.http.get<any[]>(`http://localhost:8080/api/school-fees-details/by-fees-id?feesId=${feesId}`)
      .subscribe({
        next: (response) => {
          this.schoolFeesDetails = response;
          this.calculateTotal(); // Recalculate total after fetching
        },
        error: (error) => {
          console.error('Error fetching school fees details:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch school fees details.',
            confirmButtonText: 'OK'
          });
        }
      });
  }
  
  
  

  removeDetail(index: number): void {
    const detail = this.schoolFeesDetails[index];

    if (detail.id) {
      // Store the ID of the deleted detail
      this.deletedDetails.push(detail.id);
    }

    // Remove the item from the list
    this.schoolFeesDetails.splice(index, 1);
    this.calculateTotal();
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

    // Save updated details
    this.http.post<any>('http://localhost:8080/api/school-fees-details', this.schoolFeesDetails)
      .subscribe({
        next: () => {
          alert('Fees saved successfully!');
          
          // Now delete removed details from database
          this.deleteRemovedDetails();
        },
        error: (error) => {
          console.error('Error saving fees:', error);
          alert('An error occurred while saving fees.');
        }
      });
  }

  deleteRemovedDetails(): void {
    if (this.deletedDetails.length === 0) return; // No deleted items

    this.deletedDetails.forEach((id) => {
      this.http.delete(`http://localhost:8080/api/school-fees-details/${id}`)
        .subscribe({
          next: () => {
            console.log(`Detail with ID ${id} deleted successfully.`);
          },
          error: (err) => {
            console.error(`Error deleting detail ID ${id}:`, err);
          }
        });
    });

    // Clear the deleted details list
    this.deletedDetails = [];
  }

  cancel(): void {
    this.schoolFeesSetting.total = 0;
    this.schoolFeesDetails = [];
    this.deletedDetails = [];
    this.step = 1;
  }
 
  
 
}