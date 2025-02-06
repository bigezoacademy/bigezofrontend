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

  myyear: number = 2025;
  mylevel: string = '5';
  myenrollmentStatus: string = 'active';
  myschool: string = '';
  schoolAdminId: number = localStorage.getItem("id") ? Number(localStorage.getItem("id")) : 0;

  isEditMode: boolean = false;
  currentStudent: any = null;

  message: string = '';
  messageType: string = '';

  years: number[] = [2025, 2024];
  enrollmentStatuses: string[] = ['active', 'alumni', 'inactive'];
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];

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
      title: `Send SMS to <span class="text-success">${student.firstName} ${student.lastName}</span>?`,
      html: `Are you sure you want to send an SMS to this student?<br>Phone: <strong>${student.phone}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Logic to send SMS goes here
        this.currentStudent = { ...student };
        Swal.fire(
          'Sent!',
          'SMS has been sent.',
          'success'
        );
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
