
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  sidebarVisible: boolean = false;
  message: string = ''; // To show success/error messages
  messageType: string = ''; // To determine the type of message ('success' or 'error')
  schoolName:string='';


  constructor(private router: Router, private renderer: Renderer2) {}

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
accounttype:any=localStorage.getItem("Role");
name:any=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName");

seeExistingFees: boolean = false;
ngOnInit(): void {
  const token = localStorage.getItem("Token");
  if(this.accounttype==="ROLE_ADMIN"){
   
    this.name="School Admin";
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
transactions():any{
  try {
    this.transactionToken();
    this.router.navigateByUrl("transactions");
  } catch (error) {
    alert('Failed to get transaction token from server')
  }
 
  
    }

  contact():any{
this.router.navigateByUrl("terms");
  }
  home():any{
    this.router.navigateByUrl("admin");
      }
  requirements():any{
    this.router.navigateByUrl("requirements");
      }
      requirementsdefaulters():any{
        this.router.navigateByUrl("requirementsdefaulters");
          }
      schoolfees():any{
        this.router.navigateByUrl("schoolfees");
          }
          payschoolfees():any{
            this.router.navigateByUrl("payschoolfees");
              }
          seeschoolfees():any{
            this.router.navigateByUrl("schoolfees");
              }
      newrequirement():any{
        this.router.navigateByUrl("newrequirement");
          }
          students():any{
            this.router.navigateByUrl("student");
              }
              photos():any{
                this.router.navigateByUrl("photos");
                  }
              newstudent():any{
                this.router.navigateByUrl("newstudent");
                  }
                  setschoolfees():any{
                    this.router.navigateByUrl("newschoolfees");
                      }
                      products():any{
                        this.router.navigateByUrl("products");
                          }


                  paytokenapiUrl = "http://localhost:8080/api/pesapal/request-token";
                 private paymentService=inject(PaymentService);

                  transactionToken() {
                    this.paymentService.requestPaymentToken().subscribe({
                      next: (response: { token: string, expiryDate: string, error: any, status: string, message: string }) => {  
                        // Handle the response here
                        if (response.status === '200' && response.token) {
                          const transactionToken = response.token;
                          localStorage.setItem('transactionToken', transactionToken); // Store the token in local storage
                          console.log('Payment token received and stored:', transactionToken);
                        } else {
                          console.error('Error: ' + response.message);
                        }
                      },  
                      error: (err: any) => {  
                        console.error('Error requesting payment token:', err);  
                        this.message = 'Error requesting payment token, please try again.';  
                        this.messageType = 'error'; // Set error message type  
                      },  
                    });  
                  }



  logout():any{
    // Clear the local storage
    localStorage.clear();

    // Optionally clear session storage if used
    sessionStorage.clear();

    // Navigate to the home or login page
    this.router.navigateByUrl("");
  }



  
}



