import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
  student: any[] = []; // Stores all students
  filteredStudents: any[] = []; // Stores students after filtering

  myyear: number = new Date().getFullYear();
  mylevel: string = '5';
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  enrollmentStatuses: string[] = ['active', 'alumni', 'inactive'];
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  myenrollmentStatus: string = 'active';
  myschool: string = '';
  schoolAdminId: number = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : 0;

  isEditMode: boolean = false;
  currentStudent: any = null;

  message: string = '';
  messageType: string = '';



  private http = inject(HttpClient);
  orderTrackingId: string | null = null;
  merchantReference: string | null = null;
  paymentFeedback: any;

  private route = inject(ActivatedRoute);
  
  // Search input
  searchText: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5; // Number of students per page

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.paymentFeedback = params.get('OrderTrackingId');
      this.orderTrackingId = params.get('OrderTrackingId');
      this.merchantReference = params.get('OrderMerchantReference');
    });
  }

  showstudents() {
    this.isEditMode = false;
    this.http.get<any[]>(this.studentUrl, {
      params: {
        year: this.myyear.toString(),
        level: this.mylevel,
        enrollmentStatus: this.myenrollmentStatus,
        schoolAdminId: this.schoolAdminId.toString(),
      },
    }).subscribe({
      next: (data) => {
        this.student = data;
        console.log(this.student); 
        this.applyFilters();
      },
      error: (err) => {
        this.student = [];
        console.error('Error fetching student', err);
        this.message = 'Error fetching data, please try again.';
        this.messageType = 'error';
      },
    });
  }

  applyFilters() {
    let search = this.searchText.toLowerCase();
    this.filteredStudents = this.student.filter(student =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.studentNumber.toLowerCase().includes(search)
    );
  
    this.currentPage = 1; // Reset to first page
  
    // Show detailed error message if no results found
    if (this.filteredStudents.length === 0) {
      this.message = `No ${this.myenrollmentStatus} students found in ${this.myyear}, class ${this.mylevel}.`;
      this.messageType = 'error';
    } else {
      this.message = ''; // Clear any previous error message
    }
  }
  
  

  editStudent(student: any) {
    this.isEditMode = true;
    this.currentStudent = { ...student };
    console.log(this.currentStudent.enrollmentStatus); // Log to check if the value is set correctly
  }
  

 
  sendSMS(student: any) {
    Swal.fire({
      html: `
        <h4 class="bg-dark p-3 text-white">SEND SMS <i class="bi bi-send-fill"></i></h4>
        <p>${student.firstName} ${student.lastName} : <strong> ${student.phone}</strong></p>
        <form>
          <textarea id="smsMessage" class="w-100 text-primary p-3" placeholder="Enter your message..." rows="4" style="width: 70%;"></textarea>
          <p id="charCount" style="text-align: right; font-size: 14px; margin-top: 5px;">
            0 / 160 (1 SMS)
          </p>
        </form>
  
        <!-- Cancel & Continue buttons (hidden by default) -->
        <div id="cancelButtonContainer" style="display: none;">
          <div class="row">
            <div class="col-6">
              <button id="cancelButton" class="btn btn-danger m-1 w-100">Cancel</button>
            </div>
            <div class="col-6">
              <button id="continueButton" class="btn btn-success m-1 w-100">Continue typing...</button>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Send',
      confirmButtonColor: '#28a745', // equivalent to btn-success
      cancelButtonColor: '#343a40', // equivalent to btn-dark
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,  // Prevent closing by clicking outside
      didOpen: () => {
        const smsMessage = document.getElementById('smsMessage') as HTMLTextAreaElement;
        const charCount = document.getElementById('charCount') as HTMLParagraphElement;
  
        smsMessage.addEventListener('input', () => {
          const length = smsMessage.value.length;
          const smsParts = Math.ceil(length / 160);
          charCount.textContent = `${length} / 160 (${smsParts} SMS${smsParts > 1 ? 's' : ''})`;
        });
  
        // Show Cancel and Continue typing buttons when the user clicks Cancel
        const cancelButtonContainer = document.getElementById('cancelButtonContainer');
        const cancelButton = document.getElementById('cancelButton') as HTMLButtonElement;
        const continueButton = document.getElementById('continueButton') as HTMLButtonElement;
  
        cancelButton.addEventListener('click', () => {
          // Trigger confirmation dialog when the Cancel button is clicked
          const cancelConfirmed = window.confirm("Are you sure you want to cancel?");
          
          if (cancelConfirmed) {
            Swal.close(); // Close the Swal modal if the user confirmed cancelation
          }
        });
  
        continueButton.addEventListener('click', () => {
          // Hide Cancel and Continue typing buttons and allow the user to continue typing
          cancelButtonContainer!.style.display = 'none';
        });
      },
      preConfirm: () => {
        const message = (document.getElementById('smsMessage') as HTMLTextAreaElement)?.value;
        if (!message) {
          Swal.showValidationMessage('Message cannot be empty!');
          return false;
        }
        return { message };
      }
    }).then((result: any) => {
      // If the user confirmed sending SMS
      if (result.isConfirmed) {
        let phone = student.phone;
  
        // Phone validation: check if it starts with '0' and replace it with '256'
        if (phone.startsWith('0')) {
          phone = '256' + phone.substring(1); // Replace 0 with 256
        }
  
        // Validate that the phone starts with '256'
        if (!phone.startsWith('256')) {
          Swal.fire('Invalid Phone Number', 'The phone number must start with 256.', 'error');
          return;
        }
  
        const messageContent = result.value.message;
  
        // Show loading progress while sending
        Swal.fire({
          title: 'Sending SMS...',
          text: 'Please wait while the SMS is being sent.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        // Send the SMS via API
        const smsData = {
          phone: phone,
          message: messageContent
        };
  
        const url = `http://localhost:8080/api/sms/send?phone=${encodeURIComponent(smsData.phone)}&message=${encodeURIComponent(smsData.message)}`;
  
        this.http.post(url, null, { responseType: 'text' })
          .subscribe({
            next: () => {
              console.log(`SMS sent successfully! Phone: ${smsData.phone}`);
              Swal.fire('Success', 'SMS sent successfully!', 'success');
            },
            error: (err) => {
              console.error('Error sending SMS', err);
              Swal.fire('Failed!', 'Error sending SMS.', 'error');
            }
          });
      }
    });
  }
  
  
  
  
  updateStudent() {
    if (!this.currentStudent || this.isFormInvalid()) {
      this.message = 'Please fill out all required fields correctly.';
      this.messageType = 'error';
      return;
    }

    this.http.put<any>(`${this.studentUrl}/${this.currentStudent.id}?schoolAdminId=${this.schoolAdminId}`, this.currentStudent)
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.showstudents();
          this.message = 'Student updated successfully!';
          this.messageType = 'success';
        },
        error: (err) => {
          console.error('Error updating student', err);
          this.message = 'Error updating student, please try again.';
          this.messageType = 'error';
        },
      });
  }

  isFormInvalid() {
    return !this.currentStudent.firstName || !this.currentStudent.lastName || !this.currentStudent.studentNumber ||
           !this.currentStudent.level || !this.currentStudent.birthDate || !this.currentStudent.residence ||
           !this.currentStudent.mother || !this.currentStudent.father || !this.currentStudent.phone ||
           !this.currentStudent.email || !this.currentStudent.club || !this.currentStudent.healthStatus ||
           !this.currentStudent.enrollmentStatus || !this.currentStudent.year;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.currentStudent = null;
    this.message = '';
  }

  deleteStudent(studentId: number, student: any) {
    Swal.fire({
      title: `Delete <span class="text-danger">${student.firstName} ${student.lastName}</span>?`,
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.studentUrl}/${studentId}?schoolAdminId=${this.schoolAdminId}`)
          .subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'Student has been deleted.',
                'success'
              );
              this.showstudents();
            },
            error: (err) => {
              console.error('Error deleting student', err);
              Swal.fire(
                'Error!',
                'Error deleting student, please try again.',
                'error'
              );
            },
          });
      }
    });
  }

  // Pagination Helpers
  get pagedStudents() {
    let start = (this.currentPage - 1) * this.pageSize;
    let end = start + this.pageSize;
    return this.filteredStudents.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredStudents.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.pageSize) || 1;
  }
}
