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
  
  schoolAdminId: number | null = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('id') : null)
    ? Number(typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('id') : null)
    : null;

  studentUsername: string | null = null;
  schoolName: string = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('schoolName') : '') || '';

  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  clubs: string[] =["Science","Mathematics","Debate","Music","Drama","Art","Dance","Sports"];

  // File upload states
  profilePictureFile: File | null = null;
  profilePictureUrl: string | null = null;
  profilePictureLoading: boolean = false;
  profilePictureError: string = '';
  profilePictureUploaded: boolean = false;

  studentVideoFile: File | null = null;
  studentVideoUrl: string | null = null;
  studentVideoLoading: boolean = false;
  studentVideoError: string = '';
  studentVideoUploaded: boolean = false;

  additionalImages: { file: File | null; url: string | null; loading: boolean; error: string, uploaded: boolean }[] = Array.from({ length: 10 }, () => ({ file: null, url: null, loading: false, error: '', uploaded: false }));
  additionalImagesCount: number = 1;

  studentId: number | null = null;

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
  studentEmail: string = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('studentEmail') : '') || '';
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
  
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('studentEmail', this.email);
  
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
      enrollmentStatus: this.enrollmentStatus // <-- Now included
    };
  
    const params = new HttpParams().set('schoolAdminId', String(this.schoolAdminId));
  
    //this.http.post('https://bigezo-production.up.railway.app/api/students', newStudent, { params }).subscribe({
    this.http.post('http://localhost:8080/api/students', newStudent, { params }).subscribe({
      next: (response: any) => {
        this.addStudentStatus = `  Account created successfully for ${this.firstName}_${this.lastName}.`;
        this.status = 'success';
        this.sno=sessionStorage.getItem('studentUsername')||'';
        this.spass=sessionStorage.getItem('studentPassword')||'';
        // Set studentId from backend response (assume response.id or response.studentId)
        this.studentId = response.id || response.studentId || null;
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
  
    //this.http.post('https://bigezo-production.up.railway.app/api/send-email', emailData)
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
  
    //const url = `https://bigezo-production.up.railway.app/api/sms/send?phone=${encodeURIComponent(smsData.phone)}&message=${encodeURIComponent(smsData.message)}`;
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

  // --- Profile Picture ---
  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.profilePictureError = 'Please select a valid image file.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.profilePictureError = 'Image size should be less than 2MB.';
      return;
    }
    this.profilePictureFile = file;
    this.profilePictureError = '';
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePictureUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadProfilePicture(studentId: number) {
    if (!this.profilePictureFile) return;
    this.profilePictureLoading = true;
    const formData = new FormData();
    formData.append('file', this.profilePictureFile);
    //this.http.post(`https://bigezo-production.up.railway.app/api/students/${studentId}/profile-picture?schoolAdminId=${this.schoolAdminId}`, formData, { responseType: 'text' })
    this.http.post(`http://localhost:8080/api/students/${studentId}/profile-picture?schoolAdminId=${this.schoolAdminId}`, formData, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.profilePictureLoading = false;
          this.profilePictureError = '';
          this.profilePictureUploaded = true;
          Swal.fire('Success', 'Profile picture uploaded!', 'success');
        },
        error: (err) => {
          this.profilePictureLoading = false;
          this.profilePictureError = 'Failed to upload profile picture.';
          Swal.fire('Error', 'Failed to upload profile picture.', 'error');
        }
      });
  }

  deleteProfilePicture(studentId: number) {
    this.profilePictureLoading = true;
    //this.http.delete(`https://bigezo-production.up.railway.app/api/students/${studentId}/profile-picture?schoolAdminId=${this.schoolAdminId}`)
    this.http.delete(`http://localhost:8080/api/students/${studentId}/profile-picture?schoolAdminId=${this.schoolAdminId}`)
      .subscribe({
        next: () => {
          this.profilePictureFile = null;
          this.profilePictureUrl = null;
          this.profilePictureLoading = false;
          Swal.fire('Deleted', 'Profile picture deleted.', 'success');
        },
        error: () => {
          this.profilePictureLoading = false;
          Swal.fire('Error', 'Failed to delete profile picture.', 'error');
        }
      });
  }

  // --- Student Video ---
  onStudentVideoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      this.studentVideoError = 'Please select a valid video file.';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      this.studentVideoError = 'Video size should be less than 20MB.';
      return;
    }
    this.studentVideoFile = file;
    this.studentVideoError = '';
    this.studentVideoUrl = file.name;
  }

  uploadStudentVideo(studentId: number) {
    if (!this.studentVideoFile) return;
    this.studentVideoLoading = true;
    const formData = new FormData();
    formData.append('file', this.studentVideoFile);
    //this.http.post(`https://bigezo-production.up.railway.app/api/students/${studentId}/video?schoolAdminId=${this.schoolAdminId}`, formData, { responseType: 'text' })
    this.http.post(`http://localhost:8080/api/students/${studentId}/video?schoolAdminId=${this.schoolAdminId}`, formData, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.studentVideoLoading = false;
          this.studentVideoError = '';
          this.studentVideoUploaded = true;
          Swal.fire('Success', 'Video uploaded!', 'success');
        },
        error: (err) => {
          this.studentVideoLoading = false;
          this.studentVideoError = 'Failed to upload video.';
          Swal.fire('Error', 'Failed to upload video.', 'error');
        }
      });
  }

  deleteStudentVideo(studentId: number) {
    this.studentVideoLoading = true;
    //this.http.delete(`https://bigezo-production.up.railway.app/api/students/${studentId}/video?schoolAdminId=${this.schoolAdminId}`)
    this.http.delete(`http://localhost:8080/api/students/${studentId}/video?schoolAdminId=${this.schoolAdminId}`)
      .subscribe({
        next: () => {
          this.studentVideoFile = null;
          this.studentVideoUrl = null;
          this.studentVideoLoading = false;
          Swal.fire('Deleted', 'Video deleted.', 'success');
        },
        error: () => {
          this.studentVideoLoading = false;
          Swal.fire('Error', 'Failed to delete video.', 'error');
        }
      });
  }

  // --- Additional Images ---
  onAdditionalImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.additionalImages[index].error = 'Please select a valid image file.';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.additionalImages[index].error = 'Image size should be less than 2MB.';
      return;
    }
    this.additionalImages[index].file = file;
    this.additionalImages[index].error = '';
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.additionalImages[index].url = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadAdditionalImage(studentId: number, imageNumber: number) {
    const img = this.additionalImages[imageNumber - 1];
    if (!img.file) return;
    img.loading = true;
    const formData = new FormData();
    formData.append('file', img.file);
    //this.http.post(`https://bigezo-production.up.railway.app/api/students/${studentId}/image/${imageNumber}?schoolAdminId=${this.schoolAdminId}`, formData, { responseType: 'text' })
    this.http.post(`http://localhost:8080/api/students/${studentId}/image/${imageNumber}?schoolAdminId=${this.schoolAdminId}`, formData, { responseType: 'text' })
      .subscribe({
        next: () => {
          img.loading = false;
          img.error = '';
          img.uploaded = true;
          Swal.fire('Success', `Image ${imageNumber} uploaded!`, 'success');
        },
        error: () => {
          img.loading = false;
          img.error = `Failed to upload image ${imageNumber}.`;
          Swal.fire('Error', `Failed to upload image ${imageNumber}.`, 'error');
        }
      });
  }

  deleteAdditionalImage(studentId: number, imageNumber: number) {
    const img = this.additionalImages[imageNumber - 1];
    img.loading = true;
    //this.http.delete(`https://bigezo-production.up.railway.app/api/students/${studentId}/image/${imageNumber}?schoolAdminId=${this.schoolAdminId}`)
    this.http.delete(`http://localhost:8080/api/students/${studentId}/image/${imageNumber}?schoolAdminId=${this.schoolAdminId}`)
      .subscribe({
        next: () => {
          img.file = null;
          img.url = null;
          img.loading = false;
          Swal.fire('Deleted', `Image ${imageNumber} deleted.`, 'success');
        },
        error: () => {
          img.loading = false;
          Swal.fire('Error', `Failed to delete image ${imageNumber}.`, 'error');
        }
      });
  }

  addAdditionalImage() {
    if (this.additionalImagesCount < 10) {
      this.additionalImagesCount++;
    }
  }

  getStudentId(): number | null {
    const id = this.sno;
    if (!id) return null;
    const num = Number(id);
    return isNaN(num) ? null : num;
  }

  // Load student data for editing
  editStudent(student: any) {
    // Set all fields from the student object
    this.firstName = student.firstName || '';
    this.lastName = student.lastName || '';
    this.studentNumber = student.studentNumber || '';
    this.birthDate = student.birthDate || '';
    this.residence = student.residence || '';
    this.healthStatus = student.healthStatus || '';
    this.phone = student.phone || '';
    this.email = student.email || '';
    this.studentPassword = student.password || '';
    this.club = student.club || '';
    this.level = student.level || '';
    this.year = student.year || null;
    this.mother = student.mother || '';
    this.father = student.father || '';
    this.enrollmentStatus = student.enrollmentStatus || '';
    this.studentId = student.id || student.studentId || null;
    // Set profile picture URL for preview
    if (this.studentId) {
      //this.profilePictureUrl = `https://bigezo-production.up.railway.app/api/students/${this.studentId}/profile-picture?schoolAdminId=${this.schoolAdminId}&t=${Date.now()}`;
      this.profilePictureUrl = `http://localhost:8080/api/students/${this.studentId}/profile-picture?schoolAdminId=${this.schoolAdminId}&t=${Date.now()}`;
    } else {
      this.profilePictureUrl = null;
    }
    // Optionally reset upload states
    this.profilePictureFile = null;
    this.profilePictureUploaded = false;
    this.profilePictureError = '';
  }
}
