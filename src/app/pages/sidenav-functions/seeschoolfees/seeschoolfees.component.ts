import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seeschoolfees',
  standalone: true,
 imports: [CommonModule, FormsModule],
  templateUrl: './seeschoolfees.component.html',
  styleUrl: './seeschoolfees.component.css'
})
export class SeeschoolfeesComponent {
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
  seeExistingFees: boolean=false;
  
  
    constructor(private router: Router, private renderer: Renderer2) {}
  
    displayExistingFees(): void {
      this.seeExistingFees = true;
    }
  accounttype:any=(typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem("Role") : null);


  ngOnInit(): void {
    const getLS = (key: string) => (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null);
    const setLS = (key: string, value: string) => { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, value); };
    const token = getLS("Token");
    if(this.accounttype==="ROLE_ADMIN"){
      const adminId = getLS("id");
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
          setLS('schoolName', this.schoolName);
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
