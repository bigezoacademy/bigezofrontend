import { Component, inject } from '@angular/core'; 
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

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

  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  years: number[] = [2025, 2024];
  studentEmail: string = localStorage.getItem('studentEmail') || '';
  studentPhone: string = sessionStorage.getItem('studentPhone') || '';

  private http = inject(HttpClient);

  // Function to generate a 7-digit provisional password
  generateProvisionalPassword(): string {
    var propassword: any = Math.floor(1000000 + Math.random() * 9000000).toString();
    return propassword;
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
      !this.enrollmentStatus ||
      !this.year ||
      !this.schoolAdminId
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    this.studentPassword = this.generateProvisionalPassword();

    sessionStorage.setItem('studentPassword', this.studentPassword);
    sessionStorage.setItem('studentUsername', this.studentNumber);
    sessionStorage.setItem('studentPhone', this.phone);

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
      enrollmentStatus: this.enrollmentStatus,
      year: this.year,
      mother: this.mother,
      father: this.father,
    };

    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));

    this.http.post('http://localhost:8080/api/students', newStudent, { params }).subscribe({
      next: () => {
        this.addStudentStatus = 'Student created successfully!';
        this.status = 'success';

        // Use setTimeout to ensure the UI updates
        setTimeout(() => {
          this.studentPassword = sessionStorage.getItem('studentPassword') || '';
          this.studentUsername = sessionStorage.getItem('studentUsername') || '';
          this.phone = sessionStorage.getItem('studentPhone') || '';
        });

        this.clearForm();
      },
      error: (err) => {
        this.status = 'error';
        this.addStudentStatus = 'Error! Failed to create student.';
        console.error('Error creating student', err);
      },
    });
  }

  sendEmail() {
    const emailData = {
      to: this.email,
      subject: 'Your Account Details',
      body: `Hello ${this.firstName} ${this.lastName},\n\nYour account has been created successfully.\n\nDetails:\n- Username: ${this.studentUsername}\n- Password: ${this.studentPassword}\n- Class: ${this.level}\n- Year: ${this.year}\n- Term: ${this.enrollmentStatus}`
    };

    this.http.post('http://localhost:8080/api/send-email', emailData)
      .subscribe({
        next: () => {
          alert('Email sent successfully!');
        },
        error: (err) => {
          console.error('Error sending email', err);
          alert('Failed to send email.');
        }
      });
  }

  sendSMS() {
    this.phone = sessionStorage.getItem('studentPhone') || '';
    console.log('Phone value before sending SMS:', this.phone);
    const smsData = {
      phone: this.phone,
      message: `Hello ${this.firstName} ${this.lastName},\nYour account has been created successfully.\nDetails:\n- Username: ${this.studentUsername}\n- Password: ${this.studentPassword}\n- Class: ${this.level}\n- Year: ${this.year}\n- Term: ${this.enrollmentStatus}`
    };

    const url = `http://localhost:8080/api/sms/send?phone=${encodeURIComponent(smsData.phone)}&message=${encodeURIComponent(smsData.message)}`;

    this.http.post(url, null, { responseType: 'text' })
      .subscribe({
        next: () => {
          console.log(`SMS sent successfully! Phone: ${smsData.phone}`);
          alert('SMS sent successfully!');
        },
        error: (err) => {
          console.error('Error sending SMS', err);
          alert('Failed to send SMS.');
        }
      });
  }

  clearForm() {
    // Do not clear the session or localStorage data
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
    this.schoolAdminId = localStorage.getItem('id')
      ? Number(localStorage.getItem('id'))
      : null;
  }
}
