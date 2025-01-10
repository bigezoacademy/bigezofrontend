import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent {
  accounttype:any=localStorage.getItem("Role");
  requirementsUrl: string = 'http://localhost:8080/api/requirements';
  requirements: any[] = []; // To store fetched requirements
  myyear: number = 2025;  // Default year as number
  mylevel: string = '5';  // Default level as string
  myterm: number = 1;     // Default term as number
  myschool: string = '';

  // Edit mode flag
  isEditMode: boolean = false;
  currentRequirement: any = null;  // To store the current requirement being edited

  // Message for success or error
  message: string = ''; // To show success/error messages
  messageType: string = ''; // To determine the type of message ('success' or 'error')

  // Define the possible values for year, term, and level
  years: number[] = [2025, 2024];  // Example years
  terms: number[] = [1, 2, 3];              // Example terms
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7']; // Example levels

  private http = inject(HttpClient);

  // This method will be called when the "Show All" button is clicked
  showrequirements() {
    this.http
      .get<any[]>(this.requirementsUrl, {
        params: {
          year: this.myyear.toString(),
          level: this.mylevel,
          term: this.myterm.toString(),
        },
      })
      .subscribe({
        next: (data) => {
          this.requirements = data;
        },
        error: (err) => {
          console.error('Error fetching requirements', err);
        },
      });
  }

  // Trigger the edit mode with a specific requirement
  editRequirement(requirement: any) {
    this.isEditMode = true;
    this.currentRequirement = { ...requirement }; // Copy requirement data for editing
  }

  // Update requirement by calling the backend
  updateRequirement() {
    // Check if the form is valid before attempting the update
    if (!this.currentRequirement || this.isFormInvalid()) {
      this.message = 'Please fill out all required fields correctly.';
      this.messageType = 'error'; // Show error message
      return;
    }
  
    // Proceed with updating if the form is valid
    this.http
      .put<any>(`${this.requirementsUrl}/${this.currentRequirement.id}`, this.currentRequirement)
      .subscribe({
        next: (updatedRequirement) => {
          this.isEditMode = false;
          this.showrequirements(); // Reload the requirements after update
          this.message = 'Requirement updated successfully!';
          this.messageType = 'success'; // Success message
        },
        error: (err) => {
          console.error('Error updating requirement', err);
          this.message = 'Error updating requirement, please try again.';
          this.messageType = 'error'; // Error message
        },
      });
  }
  
  // Helper method to check if the form is invalid
  isFormInvalid() {
    return !this.currentRequirement.item || !this.currentRequirement.description || !this.currentRequirement.unitCost || !this.currentRequirement.level || !this.currentRequirement.term || !this.currentRequirement.year;
  }
  

  // Cancel the edit mode
  cancelEdit() {
    this.isEditMode = false;
    this.currentRequirement = null;
    this.message = ''; // Clear message on cancel
  }


  deleteRequirement(requirementId: number) {
    if (confirm('Are you sure you want to delete this requirement?')) {
      this.http.delete(`${this.requirementsUrl}/${requirementId}`).subscribe({
        next: () => {
          this.message = 'Requirement deleted successfully!';
          this.messageType = 'success';
          this.showrequirements();  // Refresh the list of requirements
        },
        error: (err) => {
          console.error('Error deleting requirement', err);
          this.message = 'Error deleting requirement, please try again.';
          this.messageType = 'error';
        },
      });
    }
  }
  

  
}
