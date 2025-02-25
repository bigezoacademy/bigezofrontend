import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../../environment.prod';
import { map } from 'rxjs/internal/operators/map';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
  providers: [DecimalPipe],
})
export class RequirementsComponent {
    // Update endpoint as needed
  accounttype: any = localStorage.getItem('Role');
  requirementsUrl: string = 'http://localhost:8080/api/requirements';
  requirements: any[] = []; // To store fetched requirements
  myyear: number = 2025; // Default year as number
  mylevel: string = localStorage.getItem('level') ?? ''; // Default level as string
  myterm: number = 1; // Default term as number
  myschool: string = '';
  schoolAdminId: number = 0; // Ensure schoolAdminId is a number

  // Edit mode flag
  isEditMode: boolean = false;
  currentRequirement: any = null; // To store the current requirement being edited

  // Message for success or error
  message: string = ''; // To show success/error messages
  messageType: string = ''; // To determine the type of message ('success' or 'error')

  // Define the possible values for year, term, and level
  years: number[] = []; 

ngOnInit() {
  const currentYear = new Date().getFullYear();
  this.years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Generates last 10 years
}

  terms: number[] = [1, 2, 3]; // Example terms
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7']; // Example levels

  private http = inject(HttpClient);
  private router=inject(Router);
  private paymentService=inject(PaymentService);  // This method will be called when the "Show All" button is clicked
  showrequirements() {
    this.isEditMode = false;
  
    // Retrieve chosen role and set schoolAdminId based on the role
    const chosenrole: string = localStorage.getItem('Role') || '';
    if (chosenrole === 'ROLE_USER') {
      this.schoolAdminId = parseInt(localStorage.getItem('schoolAdminId') || '0');
    } else if (chosenrole === 'ROLE_ADMIN') {
      this.schoolAdminId = parseInt(localStorage.getItem('id') || '0');
    }
  
    // Validate schoolAdminId
    if (isNaN(this.schoolAdminId) || this.schoolAdminId <= 0) {
      console.error('Invalid schoolAdminId value.');
      this.message = 'Invalid schoolAdminId value.';
      this.messageType = 'error';
      return;
    }
  
   
    
    // Fetch requirements
    this.http
      .get<any[]>(this.requirementsUrl, {
        params: {
          year: this.myyear.toString(),
          level: this.mylevel,
          term: this.myterm.toString(),
          schoolAdminId: this.schoolAdminId.toString(),
        },
      })
      .subscribe({
        next: (data) => {
          this.requirements = data;
          console.log(`Chosen school admin id. --- ${this.schoolAdminId}`);
          // Check if no data was returned
          if (this.requirements.length === 0) {
            this.message = 'No data found'; // Set error message
            this.messageType = 'error'; // Set message type to error
          } else {
            this.message = ''; // Clear message if data is present
          }
        },
        error: (err) => {
          this.requirements = [];
          console.error('Error fetching requirements', this.schoolAdminId);
          this.message = `Error fetching data, please try again. --- ${this.schoolAdminId}`; // Set error message on failure
          this.messageType = 'error'; // Set message type to error
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
      .put<any>(
        `${this.requirementsUrl}/${this.currentRequirement.id}?schoolAdminId=${this.schoolAdminId}`,
        this.currentRequirement
      )
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
    return (
      !this.currentRequirement.item ||
      !this.currentRequirement.description ||
      !this.currentRequirement.unitCost ||
      !this.currentRequirement.level ||
      !this.currentRequirement.term ||
      !this.currentRequirement.year ||
      !this.currentRequirement.quantity
    );
  }

  // Cancel the edit mode
  cancelEdit() {
    this.isEditMode = false;
    this.currentRequirement = null;
    this.message = ''; // Clear message on cancel
  }

  deleteRequirement(requirementId: number) {
    if (confirm('Are you sure you want to delete this requirement?')) {
      this.http
        .delete(`${this.requirementsUrl}/${requirementId}?schoolAdminId=${this.schoolAdminId}`)
        .subscribe({
          next: () => {
            this.message = 'Requirement deleted successfully!';
            this.messageType = 'success';
            this.showrequirements(); // Refresh the list of requirements
          },
          error: (err) => {
            console.error('Error deleting requirement', err);
            this.message = 'Error deleting requirement, please try again.';
            this.messageType = 'error';
          },
        });
    }
  }

  // Calculate the grand total for all requirements
  calculateGrandTotal(): number {
    return this.requirements.reduce((total, requirement) => {
      return total + requirement.unitCost * requirement.quantity;
    }, 0);
  }

  // Calculate the total for selected requirements
  calculateSelectedTotal(): number {
    const selectedCheckboxes = document.querySelectorAll(
      'input.selectRow:checked'
    ) as NodeListOf<HTMLInputElement>;

    if (selectedCheckboxes.length === 0) {
      return this.calculateGrandTotal(); // Return the grand total if no checkboxes are selected
    }

    let total = 0;
    selectedCheckboxes.forEach((checkbox) => {
      const index = parseInt(checkbox.dataset['index']!, 10);
      const requirement = this.requirements[index];
      if (requirement) {
        total += requirement.unitCost * requirement.quantity;
      }
    });

    return total;
  }


  paymentDetails = {
    location: '',
  };
  selectedItems: any[] = JSON.parse(localStorage.getItem('selectedItems') || '[]');

  calculateTotal(): number {
    return this.selectedItems.reduce((total, item) => total + item.unitCost * item.quantity, 0);
  }

  payForSelectedItems() {
  
    const selectedCheckboxes = document.querySelectorAll(
        'input.selectRow:checked'
    ) as NodeListOf<HTMLInputElement>;

    this.selectedItems = Array.from(selectedCheckboxes).map((checkbox) => {
        const index = parseInt(checkbox.dataset['index']!, 10);
        return this.requirements[index];
    });

    const totalAmount = this.selectedItems.reduce(
        (total, item) => total + item.unitCost * item.quantity,
        0
    );

    // Store selected items and total amount in local storage
    localStorage.setItem('selectedItems', JSON.stringify(this.selectedItems));
    localStorage.setItem('totalAmount', totalAmount.toString());

    /* console.log('Selected items and total amount stored in local storage:', {
        selectedItems: this.selectedItems,
        totalAmount,
    }); */
    this.requestPaymentToken();
   
}

paytokenapiUrl = "http://localhost:8080/api/pesapal/request-token";

requestPaymentToken() {
  this.paymentService.requestPaymentToken().subscribe({
    next: (response: { token: string, expiryDate: string, error: any, status: string, message: string }) => {  
      // Handle the response here
      if (response.status === '200' && response.token) {
        const paymentToken = response.token;
        localStorage.setItem('paymentToken', paymentToken); // Store the token in local storage
        sessionStorage.setItem('paymentToken', paymentToken);
        sessionStorage.setItem('paymentTokenExpiry', '300');
        console.log('Payment token received and stored:', '');
        this.router.navigate(['/pay']); // Redirect to the payment page
      } else {
        console.error('Error: ' + response.message);
      }
    },  
    error: (err) => {  
      console.error('Error requesting payment token:', err);  
      this.message = 'Error requesting payment token, please try again.';  
      this.messageType = 'error'; // Set error message type  
    },  
  });  
}



}
