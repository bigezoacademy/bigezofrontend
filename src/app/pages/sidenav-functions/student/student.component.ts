import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [DecimalPipe]
})
export class StudentComponent {
  accounttype: any = localStorage.getItem("Role");
  studentUrl: string = 'http://localhost:8080/api/students';
  student: any[] = []; // To store fetched student data
  myyear: number = 2025;  // Default year as number
  mylevel: string = '5';  // Default level as string
  myenrollmentStatus: string = 'active'; // Default enrollmentStatus as string
  myschool: string = '';
  schoolAdminId: number = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : 0;

  // Edit mode flag
  isEditMode: boolean = false;
  currentStudent: any = null;  // To store the current student being edited

  // Message for success or error
  message: string = ''; // To show success/error messages
  messageType: string = ''; // To determine the type of message ('success' or 'error')

  // Define the possible values for year, enrollmentStatus, and level
  years: number[] = [2025, 2024];  // Example years
  enrollmentStatuses: string[] = ['active', 'alumni', 'inactive']; // Possible enrollment statuses
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7']; // Example levels

  private http = inject(HttpClient);
  orderTrackingId: string | null = null;
  merchantReference: string | null = null;
  paymentFeedback: any;

 private route = inject(ActivatedRoute);
  ngOnInit(): void {
    // Extract query parameters
   
    this.route.queryParamMap.subscribe(params => {
      this.paymentFeedback=params.get('OrderTrackingId');
      this.orderTrackingId = params.get('OrderTrackingId');
      this.merchantReference = params.get('OrderMerchantReference');
    });
  }

  // This method will be called when the "Show All" button is clicked
  showstudents() {
    this.isEditMode = false;
    this.http
      .get<any[]>(this.studentUrl, {
        params: {
          year: this.myyear.toString(),
          level: this.mylevel,
          enrollmentStatus: this.myenrollmentStatus,  // Send enrollmentStatus in the API request
          schoolAdminId: this.schoolAdminId.toString(),
        },
      })
      .subscribe({
        next: (data) => {
          this.student = data;

          // Check if no data was returned
          if (this.student.length === 0) {
            this.message = 'No data found'; // Set error message
            this.messageType = 'error'; // Set message type to error
          } else {
            this.message = ''; // Clear message if data is present
          }
        },
        error: (err) => {
          this.student = [];
          console.error('Error fetching student', err);
          this.message = 'Error fetching data, please try again.'; // Set error message on failure
          this.messageType = 'error'; // Set message type to error
        },
      });
  }

  // Trigger the edit mode with a specific student
  editStudent(student: any) {
    this.isEditMode = true;
    this.currentStudent = { ...student }; // Copy student data for editing
  }

  // Update student by calling the backend
  updateStudent() {
    // Check if the form is valid before attempting the update
    if (!this.currentStudent || this.isFormInvalid()) {
      this.message = 'Please fill out all required fields correctly.';
      this.messageType = 'error'; // Show error message
      return;
    }

    // Proceed with updating if the form is valid
    this.http
      .put<any>(`${this.studentUrl}/${this.currentStudent.id}?schoolAdminId=${this.schoolAdminId}`, this.currentStudent)
      .subscribe({
        next: (updatedStudent) => {
          this.isEditMode = false;
          this.showstudents(); // Reload the student after update
          this.message = 'Student updated successfully!';
          this.messageType = 'success'; // Success message
        },
        error: (err) => {
          console.error('Error updating student', err);
          this.message = 'Error updating student, please try again.';
          this.messageType = 'error'; // Error message
        },
      });
  }

  // Helper method to check if the form is invalid
  isFormInvalid() {
    return !this.currentStudent.firstName || !this.currentStudent.lastName || !this.currentStudent.studentNumber ||
           !this.currentStudent.level || !this.currentStudent.birthDate || !this.currentStudent.residence ||
           !this.currentStudent.mother || !this.currentStudent.father || !this.currentStudent.phone ||
           !this.currentStudent.email || !this.currentStudent.club || !this.currentStudent.healthStatus ||
           !this.currentStudent.enrollmentStatus || !this.currentStudent.year;
  }

  // Cancel the edit mode
  cancelEdit() {
    this.isEditMode = false;
    this.currentStudent = null;
    this.message = ''; // Clear message on cancel
  }

  // Delete student
  deleteStudent(studentId: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.http.delete(`${this.studentUrl}/${studentId}?schoolAdminId=${this.schoolAdminId}`).subscribe({
        next: () => {
          this.message = 'Student deleted successfully!';
          this.messageType = 'success';
          this.showstudents();  // Refresh the list of student
        },
        error: (err) => {
          console.error('Error deleting student', err);
          this.message = 'Error deleting student, please try again.';
          this.messageType = 'error';
        },
      });
    }
  }
}
