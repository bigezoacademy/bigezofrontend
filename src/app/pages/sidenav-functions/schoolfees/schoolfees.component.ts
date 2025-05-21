import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SchoolFeesSetting } from '../../../school-fees-setting.model';

@Component({
  selector: 'app-schoolfees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schoolfees.component.html',
  styleUrls: ['./schoolfees.component.css']
})
export class SchoolfeesComponent implements OnInit {
  myyear: number = new Date().getFullYear();
  myterm: number = 1;
  schooladmin: string = '';
  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  fees: SchoolFeesSetting[] = [];
  message: string = '';
  messageType: string = '';
  schoolName: string = '';
  adminId: string = '';

  accounttype: any = localStorage.getItem('Role');

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (!token) {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigateByUrl('');
    }
  }

  displayExistingFees(): void {
    this.setAdminId();
    if (this.adminId) {
      this.http.get<SchoolFeesSetting[]>(`http://localhost:8080/api/school-fees-settings/find-by-year-and-admin?year=${this.myyear}&schoolAdminId=${this.adminId}`)
        .subscribe(
          data => {
            if (data && data.length > 0) {
              this.fees = data;
              this.message=` Found  ${data.length} rows`;
            } else {
              this.fees = [];
              Swal.fire({
                title: 'No Fees Found',
                icon: 'info',
                confirmButtonText: 'OK'
              });
            }
          },
          error => {
            console.error('Error fetching fees:', error);
            this.fees = [];
            if (error.status === 0) {
              this.message = 'Unable to connect to the server. Please check your internet connection or contact the system administrator.';
            } else {
              this.message = 'There is no school fees set for the selected year. Contact school admin.';
            }
            this.messageType = 'error';
          }
        );
    }
  }

  viewFeesDetails(feesId: number,feesYear:string,feesLevel:string,feesTerm:string): void {
    this.setAdminId();
    this.http.get<any>(`http://localhost:8080/api/school-fees-details/by-fees-id?feesId=${feesId}`)
      .subscribe(
        (data) => {
          if (!data || data.length === 0) {
         
              this.message = 'No data found'; 
              this.messageType = 'success';
          
            return;
          }

          const detailsArray = Array.isArray(data) ? data : [data];
          let totalAmount = detailsArray.reduce((sum, detail) => sum + detail.amount, 0);
          let formattedTotalAmount = totalAmount.toLocaleString();

          let detailsTable = `
          <h3 class="text-success p-3">Fees Details</h3>
          <h5 class="bg-warning p-3 text-secondary"> Year: <span class="text-dark me-1">${this.myyear}</span>,Class: <span class="text-dark me-1">${feesLevel}</span>, Term: <span class="text-dark me-1">${feesTerm}</span>    </h5>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th class="text-start">ID</th>
                  <th class="text-start">Item</th>
                  <th class="text-start">Description</th>
                  <th class="text-start">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${detailsArray.map(detail => `
                  <tr style="border-bottom:1px solid #000000;">
                    <td class="text-start feesdetail" style="font-size: 14px !important;">${detail.id}</td>
                    <td class="text-start feesdetail" style="font-size: 14px !important;">${detail.item}</td>
                    <td class="text-start feesdetail" style="font-size: 14px !important;">${detail.description}</td>
                    <td class="text-start feesdetail" style="font-size: 14px !important;">${detail.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          <p>Total:  <span class="text-end mt-3 fw-normal" style="font-size:30px;">  UGX <span class="text-danger fw-bold">  ${formattedTotalAmount}</span> </span></p>
          `;

            Swal.fire({
              html: `
              <div style="overflow-x:auto;">
                <div class="table-responsive">
                ${detailsTable}
                </div>
              </div>
              `,
              confirmButtonText: 'Close',
              width: '90vw', // Allow modal to expand to 90% of viewport width
              customClass: {
              popup: 'swal-wide-table'
              }
            });
        },
        (error) => {
          console.error('Error fetching school fees details:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to fetch school fees details. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
  }

  private setAdminId(): void {
    if (this.accounttype === 'ROLE_ADMIN') {
      this.adminId = localStorage.getItem('id') || '';
    } else if (this.accounttype === 'ROLE_USER') {
      this.adminId = localStorage.getItem('schoolAdminId') || '';
    }
  }
}
