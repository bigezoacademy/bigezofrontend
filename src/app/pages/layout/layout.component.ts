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
  message: string = '';
  messageType: string = '';
  schoolName: string = '';
  accounttype: any = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem("Role") : null);
  name: any = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem("firstName") : "") + " " + (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem("lastName") : "");
  seeExistingFees: boolean = false;
  subscriptionStatus: string | null = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('subscriptionStatus') : null);
  subscriptionInProgress: boolean = (typeof window !== 'undefined' && window.localStorage ? !!window.localStorage.getItem('paymentIframeUrl') : false);

  constructor(private router: Router, private renderer: Renderer2) {}

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  goToSubscription() {
    this.router.navigateByUrl('subscription');
  }

  ngOnInit(): void {
    const getLS = (key: string) => (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null);
    const setLS = (key: string, value: string) => { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, value); };
    const clearLS = () => { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.clear(); };
    const token = getLS("Token");
    if(this.accounttype==="ROLE_ADMIN"){
      this.name="School Admin";
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
      clearLS();
      if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.clear();
      this.router.navigateByUrl("");
  }
}
transactions():any{
  try {
  
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


                  //paytokenapiUrl = "https://bigezo-production.up.railway.app/api/pesapal/request-token";
                  paytokenapiUrl = "http://localhost:8080/api/pesapal/request-token";
                 private paymentService=inject(PaymentService);

            
                  



  logout():any{
    // Clear the local storage
    localStorage.clear();

    // Optionally clear session storage if used
    sessionStorage.clear();

    // Navigate to the home or login page
    this.router.navigateByUrl("");
  }

  hideSidebarOnNav(): void {
    // Hide sidebar only on small screens (e.g., < 768px)
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
  }

  
}



