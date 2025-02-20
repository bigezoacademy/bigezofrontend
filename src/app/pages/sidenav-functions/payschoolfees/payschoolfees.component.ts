import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payschoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payschoolfees.component.html',
  styleUrl: './payschoolfees.component.css'
})


export class PaySchoolfeesComponent implements OnInit {
 private http = inject(HttpClient);
  myyear: number = new Date().getFullYear(); 
  mylevel: string = localStorage.getItem('level') ?? ''; 
  myterm: number = 1; 
  schooladmin: string = 'admin123';
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  fees: any[] = []; // Stores fetched fee amounts
  terms: number[] = [1, 2, 3];
    message: string = ''; // To show success/error messages
    messageType: string = ''; // To determine the type of message ('success' or 'error')
    schoolName:string='';
    schoolAdminId:any=null;
  
  
    constructor(private router: Router, private renderer: Renderer2) {}
  

  accounttype:any=localStorage.getItem("Role");


  ngOnInit(): void {
    const token = localStorage.getItem("Token");
    if(this.accounttype==="ROLE_ADMIN"){
     
      const adminId = localStorage.getItem("id");
       // Assuming the token is stored in localStorage
      if (adminId && token) {
        fetch(`http://localhost:8080/api/school-admins/${adminId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          this.schoolName = data.schoolName;
          localStorage.setItem('schoolName', this.schoolName);
        })
        .catch(error => {
          console.error('Error fetching school name:', error);
          this.message = 'Error fetching school name, please try again.';
          this.messageType = 'error';
        });
      }
    }
    else if(!token){
       // Clear the local storage
       localStorage.clear();
  
       // Optionally clear session storage if used
       sessionStorage.clear();
   
       // Navigate to the home or login page
       this.router.navigateByUrl("");
    }
  }

  displayAmounts(): void {
    
    if(this.accounttype==="ROLE_USER"){
      this.schoolAdminId=localStorage.getItem("schoolAdminId");
    }
    if(this.accounttype==="ROLE_ADMIN"){
      this.schoolAdminId=localStorage.getItem("id");
    }
      if (!this.schoolAdminId) {
        Swal.fire({
          icon: 'error',
          title: 'Missing School Admin ID',
          text: 'School Admin ID is required.',
          confirmButtonText: 'OK'
        });
        return;
      }
    
      if (!this.myyear || !this.myterm || !this.mylevel) {
        let missingItem = !this.myyear ? 'Year' : !this.myterm ? 'Term' : 'Class';
        Swal.fire({
          icon: 'warning',
          title: 'Missing Selection',
          text: `Please select ${missingItem}!`,
          confirmButtonText: 'OK'
        });
        return;
      }
    
      
      this.http.get<number>(`http://localhost:8080/api/school-fees-settings/find-by-year-term-level-and-admin?year=${this.myyear}&term=${this.myterm}&level=${this.mylevel}&schoolAdminId=${this.schoolAdminId}`)
        .subscribe({
          next: (existingId) => {
            if (existingId) {
              
              Swal.fire({
                icon: 'info',
                title: 'Entry Exists',
                text: `An entry Found with ID: ${existingId}`,
                showCancelButton: true,
                confirmButtonText: 'View Details',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.fetchSchoolFeesDetails(existingId); // Fetch the details
                }
              });
            } else {
              //-----------------------
            }
          },
          error: (error) => {
            console.error('Error checking existing entry:', error);
            Swal.fire({
              icon: 'error',
              text: `An error occurred ------ ${error.message}.`,
              confirmButtonText: 'OK'
            });
          }
        });
  }

    fetchSchoolFeesDetails(feesId: number): void {
      this.http.get<any[]>(`http://localhost:8080/api/school-fees-details/by-fees-id?feesId=${feesId}`)
        .subscribe({
          next: (response) => {
            this.fees = response;
            this.getTotalAmount(); // Recalculate total after fetching
          },
          error: (error) => {
            console.error('Error fetching school fees details:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to fetch school fees details.',
              confirmButtonText: 'OK'
            });
          }
        });
    }

  getTotalAmount(): number {
    return this.fees.reduce((sum, fee) => sum + fee.amount, 0);
  }
}

