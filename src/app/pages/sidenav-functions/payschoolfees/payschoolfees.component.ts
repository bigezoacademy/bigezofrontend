import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payschoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payschoolfees.component.html',
  styleUrl: './payschoolfees.component.css'
})


export class SchoolfeesComponent implements OnInit {
  myyear: number = new Date().getFullYear();
  mylevel: string = '1';
  myterm: number = 1;
  schooladmin: string = 'admin123';
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  fees: any[] = []; // Stores fetched fee amounts
  terms: number[] = [1, 2, 3];
    message: string = ''; // To show success/error messages
    messageType: string = ''; // To determine the type of message ('success' or 'error')
    schoolName:string='';
  
  
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
    // Dummy data
    this.fees = [
      { item: 'Tuition', amount: 800000 },
      { item: 'Library Fee', amount: 50000 },
      { item: 'Exam Fee', amount: 100000 }
    ];
    console.log('Selected Year:', this.myyear);
    console.log('Selected Level:', this.mylevel);
    console.log('School Admin:', this.schooladmin);
  }
  getTotalAmount(): number {
    return this.fees.reduce((sum, fee) => sum + fee.amount, 0);
  }
}

