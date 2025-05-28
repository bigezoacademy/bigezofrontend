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
  gender: string = '';

  schoolAdminId: number | null = localStorage.getItem('id')
    ? Number(localStorage.getItem('id'))
    : null;

  studentUsername: string | null = null;
  schoolName: string = localStorage.getItem('schoolName') || ''; // Fetch from localStorage

  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  clubs: string[] =["Science","Mathematics","Debate","Music","Drama","Art","Dance","Sports"];

  // --- File Upload State ---
  studentId: number | null = null;

  // Profile Picture
  profilePictureFile: File | null = null;
  profilePictureUrl: string | null = null;
  profilePictureUploading: boolean = false;
  profilePictureUploaded: boolean = false;

  // Student Video
  studentVideoFile: File | null = null;
  studentVideoUrl: string | null = null;
  studentVideoUploading: boolean = false;
  studentVideoUploaded: boolean = false;

  // Additional Images (up to 10)
  additionalImages: { file: File | null; url: string | null; uploading: boolean; error: string }[] = [];
  pendingAdditionalImages: File[] = [];
  additionalImagesUploading: boolean = false;
  additionalImagesUploaded: boolean = false;
  uploadedImagesCount: number = 0; // Track number of uploaded images
  totalImagesToUpload: number = 0; // Total number of images to upload

  constructor(private clubService: ClubserviceService, private http: HttpClient, private router: Router) {
    this.fetchClubs();
    this.additionalImages = [];
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

  generateProvisionalPassword(): string {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }

  // --- File Upload Handlers ---
  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire('Invalid file', 'Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('File too large', 'Image size should be less than 2MB.', 'error');
      return;
    }
    this.profilePictureFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePictureUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

 uploadProfilePicture() {
    if (!this.profilePictureFile || !this.studentId || !this.schoolAdminId) return;
    this.profilePictureUploading = true;
    const formData = new FormData();
    formData.append('file', this.profilePictureFile);
    
    // Add schoolAdminId as a parameter
    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));
    
    this.http.post(
      `http://localhost:8080/api/students/${this.studentId}/profile-picture`,
      formData,
      { params: params, responseType: 'text' } // <-- Fix: expect plain text response
    ).subscribe({
      next: (res: any) => {
        this.profilePictureUploading = false;
        this.profilePictureUploaded = true;
        Swal.fire('Success', 'Profile picture uploaded!', 'success');
      },
      error: () => {
        this.profilePictureUploading = false;
        Swal.fire('Error', 'Failed to upload profile picture.', 'error');
      }
    });
}

  removeProfilePicture() {
    this.profilePictureFile = null;
    this.profilePictureUrl = null;
    this.profilePictureUploaded = false;
  }

  onStudentVideoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      Swal.fire('Invalid file', 'Please select a valid video file.', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      Swal.fire('File too large', 'Video size should be less than 20MB.', 'error');
      return;
    }
    this.studentVideoFile = file;
    this.studentVideoUrl = URL.createObjectURL(file);
  }

 uploadStudentVideo() {
    if (!this.studentVideoFile || !this.studentId || !this.schoolAdminId) return;
    this.studentVideoUploading = true;
    const formData = new FormData();
    formData.append('file', this.studentVideoFile);
    
    // Add schoolAdminId as a parameter
    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));
    
    this.http.post(
      `http://localhost:8080/api/students/${this.studentId}/video`,
      formData,
      { params: params, responseType: 'text' } // <-- Fix: expect plain text response
    ).subscribe({
      next: (res: any) => {
        this.studentVideoUploading = false;
        this.studentVideoUploaded = true;
        Swal.fire('Success', 'Student video uploaded!', 'success');
      },
      error: () => {
        this.studentVideoUploading = false;
        Swal.fire('Error', 'Failed to upload video.', 'error');
      }
    });
}

  removeStudentVideo() {
    this.studentVideoFile = null;
    this.studentVideoUrl = null;
    this.studentVideoUploaded = false;
  }

  onAdditionalImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire('Invalid file', 'Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      Swal.fire('File too large', 'Image size should be less than 5MB.', 'error');
      return;
    }
    if (this.additionalImages.length >= 10) {
      Swal.fire('Limit reached', 'You can only upload up to 10 images.', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.additionalImages.push({ file, url: e.target.result, uploading: false, error: '' });
      this.pendingAdditionalImages.push(file);
    };
    reader.readAsDataURL(file);
  }

uploadAdditionalImages() {
  if (!this.additionalImages.length || !this.studentId || !this.schoolAdminId) return;

  this.additionalImagesUploading = true;
  let uploadCount = 0;
  let errorCount = 0;
  const totalToUpload = this.additionalImages.filter(img => !!img.file).length;
  this.uploadedImagesCount = 0; // For progress indicator
  this.totalImagesToUpload = totalToUpload;

  if (totalToUpload === 0) {
    this.additionalImagesUploading = false;
    Swal.fire('Info', 'No images to upload.', 'info');
    return;
  }

  this.additionalImages.forEach((img, idx) => {
    if (!img.file) return;
    img.uploading = true;
    const formData = new FormData();
    formData.append('file', img.file);
    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));
    this.http.post(
      `http://localhost:8080/api/students/${this.studentId}/image/${idx + 1}`,
      formData,
      { params: params, responseType: 'text' }
    ).subscribe({
      next: () => {
        img.uploading = false;
        uploadCount++;
        this.uploadedImagesCount++;
        if (uploadCount + errorCount === totalToUpload) {
          this.additionalImagesUploading = false;
          if (errorCount === 0) {
            this.additionalImagesUploaded = true;
            Swal.fire('Success', 'All images uploaded!', 'success');
          }
        }
      },
      error: () => {
        img.uploading = false;
        errorCount++;
        this.uploadedImagesCount++;
        if (uploadCount + errorCount === totalToUpload) {
          this.additionalImagesUploading = false;
          Swal.fire('Error', 'Some images failed to upload.', 'error');
        }
      }
    });
  });
}

  removeAdditionalImage(index: number) {
    this.additionalImages.splice(index, 1);
    this.pendingAdditionalImages = this.additionalImages.map(img => img.file!).filter(f => !!f);
    this.additionalImagesUploaded = false;
  }

  // --- Student Creation ---
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
      enrollmentStatus: this.enrollmentStatus // <-- Add this line
    };

    // Use schoolAdminId as a query parameter (previous version)
    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));
    this.http.post<any>('http://localhost:8080/api/students', newStudent, { params }).subscribe({
      next: (res) => {
        this.addStudentStatus = `  Account created successfully for ${this.firstName}_${this.lastName}.`;
        this.status = 'success';
        this.sno = sessionStorage.getItem('studentUsername') || '';
        this.spass = sessionStorage.getItem('studentPassword') || '';
        this.studentId = res.id || res.studentId || null;
        // Hide form inputs after success
        // (Handled in template: form is hidden when status === 'success' && studentId)
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
