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
  password: string = '';
  club: string = '';
  level: string = '';
  enrollmentStatus: string = '';
  year: number | null = null;
  mother: string = '';
  father: string = '';
  schoolAdminId: number | null = localStorage.getItem('id')
    ? Number(localStorage.getItem('id'))
    : null;

  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  years: number[] = [2025, 2024];

  private http = inject(HttpClient);

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
      !this.password ||
      !this.level ||
      !this.enrollmentStatus ||
      !this.year ||
      !this.schoolAdminId
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const newStudent = {
      firstName: this.firstName,
      lastName: this.lastName,
      studentNumber: this.studentNumber,
      birthDate: this.birthDate,
      residence: this.residence,
      healthStatus: this.healthStatus,
      phone: this.phone,
      email: this.email,
      password: this.password,
      club: this.club,
      level: this.level,
      enrollmentStatus: this.enrollmentStatus,
      year: this.year,
      mother: this.mother,
      father: this.father,
    };

    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));

    this.http
      .post('http://localhost:8080/api/students', newStudent, { params })
      .subscribe({
        next: () => {
          this.addStudentStatus = 'Student created successfully!';
          this.status = 'success';
          this.clearForm();
        },
        error: (err) => {
          this.status = 'error';
          this.addStudentStatus = 'Error! Failed to create student.';
          console.error('Error creating student', err);
        },
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
    this.password = '';
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
