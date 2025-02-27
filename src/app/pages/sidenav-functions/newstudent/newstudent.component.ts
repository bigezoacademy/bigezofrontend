import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClubserviceService } from '../../../services/clubservice.service';

@Component({
  selector: 'app-newstudent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newstudent.component.html',
  styleUrls: ['./newstudent.component.css'],
})
export class NewStudentComponent {
  addStudentStatus: string = 'status message';
  status: string | null = null;

  // Fields
  firstName: string = '';
  lastName: string = '';
  studentNumber: string = '';
  sno:string='';
  spass:string='';
  birthDate: string = '';
  residence: string = '';
  healthStatus: string = '';
  phone: string = '';
  email: string = '';
  studentPassword: string = '';
  club: string = '';
  level: string = '';
  enrollmentStatus: string = '';
  year: number | null = null;
  mother: string = '';
  father: string = '';
  
  schoolAdminId: number | null = localStorage.getItem('id')
    ? Number(localStorage.getItem('id'))
    : null;

  studentUsername: string | null = null;
  schoolName: string = localStorage.getItem('schoolName') || ''; // Fetch from localStorage

  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  clubs: string[] =["Science","Mathematics","Debate","Music","Drama","Art","Dance","Sports"];

  constructor(private clubService: ClubserviceService) {
    this.fetchClubs();
  }

  fetchClubs() {
    this.clubService.getClubs().subscribe({
      next: (data: string[]) => {
        this.clubs = data;
      },
      error: (err) => {
        console.error('Error fetching clubs', err);
      }
    });
  }
  
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  studentEmail: string = localStorage.getItem('studentEmail') || '';
  studentPhone: string = sessionStorage.getItem('studentPhone') || '';
  private http = inject(HttpClient);
  private router = inject(Router);

  generateProvisionalPassword(): string {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }

  createStudent() {
    if (
      !this.firstName ||
      !this.lastName ||
      !this.studentNumber ||
      !this.birthDate ||
      !this.residence ||
      !this.healthStatus ||
      !this.phone ||
      !this.email ||
      !this.level ||
      !this.year ||
      !this.schoolAdminId ||
      !this.schoolName
    ) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }
  
    this.studentPassword = this.generateProvisionalPassword();
  
    setTimeout(() => {
      sessionStorage.setItem('studentPassword', this.studentPassword);
      sessionStorage.setItem('studentUsername', this.studentNumber);
      sessionStorage.setItem('studentPhone', this.phone);
      sessionStorage.setItem('studentFirstName', this.firstName);
      sessionStorage.setItem('studentLastName', this.lastName);
      sessionStorage.setItem('studentLevel', this.level);
      sessionStorage.setItem('accountType', this.level);
      sessionStorage.setItem('studentYear', this.year?.toString() || '');
    });
  
    localStorage.setItem('studentEmail', this.email);
  
    const newStudent = {
      firstName: this.firstName,
      lastName: this.lastName,
      studentNumber: this.studentNumber,
      birthDate: this.birthDate,
      residence: this.residence,
      healthStatus: this.healthStatus,
      phone: this.phone,
      email: this.email,
      password: this.studentPassword,
      club: this.club,
      level: this.level,
      year: this.year,
      mother: this.mother,
      father: this.father,
    };
  
    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));
  
    this.http.post('http://localhost:8080/api/students', newStudent, { params }).subscribe({
      next: () => {
        this.addStudentStatus = `  Account created successfully for ${this.firstName}_${this.lastName}.`;
        this.status = 'success';
        this.sno=sessionStorage.getItem('studentUsername')||'';
        this.spass=sessionStorage.getItem('studentPassword')||'';

        this.clearForm();
      },
      error: (err) => {
        this.status = 'error';
        this.addStudentStatus = 'Error! Failed to create student.';
        console.error('Error creating student', err);
        Swal.fire('Error', 'Failed to create student.', 'error');
      },
    });
  }
  
  sendEmail() {
    const emailData = {
      to: this.email,
      subject: 'Your Account Details',
      body: `Hello ${this.firstName} ${this.lastName},\n\n` +
            `Your account has been created successfully.\n\n` +
            `Details:\n- Username: ${this.studentNumber}\n` +
            `- Password: ${this.studentPassword}\n` +
            `- Class: ${this.level}\n` +
            `- Year: ${this.year}\n\n` +
            `Thank you`
    };
  
    this.http.post('http://localhost:8080/api/send-email', emailData)
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Email sent successfully!', 'success');
        },
        error: (err) => {
          console.error('Error sending email', err);
          Swal.fire('Error', 'Failed to send email.', 'error');
        }
      });
  }
  
  sendSMS() {
    let phone = sessionStorage.getItem('studentPhone') || '';
  
    if (phone.startsWith('0')) {
      phone = '256' + phone.substring(1);
    }
  
    const smsData = {
      phone: phone,
      message: `Hello ${sessionStorage.getItem('studentFirstName')} ${sessionStorage.getItem('studentLastName')},\n` +
               `Welcome to ${this.schoolName}!\n\n` +
               `Your account has been created successfully.\n\n` +
               `Login Details:\n` +
               `- Username: ${sessionStorage.getItem('studentUsername')}\n` +
               `- Password: ${sessionStorage.getItem('studentPassword')}\n\n` +
               `Enrollment Information:\n` +
               `- Class: ${sessionStorage.getItem('studentLevel')}\n` +
               `- Year: ${sessionStorage.getItem('studentYear')}\n\n` +
               `Thank you.`
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
          Swal.fire('Error', 'Failed to send SMS.', 'error');
        }
      });
  }
  

  clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.studentNumber = '';
    this.birthDate = '';
    this.residence = '';
    this.healthStatus = '';
    this.phone = '';
    this.email = '';
    this.studentPassword = '';
    this.club = '';
    this.level = '';
    this.enrollmentStatus = '';
    this.year = null;
    this.mother = '';
    this.father = '';

    // Retain admin ID
    this.schoolAdminId = localStorage.getItem('id')
      ? Number(localStorage.getItem('id'))
      : null;
  }

  students():any{
    this.router.navigateByUrl("student");
  }
}
