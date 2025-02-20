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
              Swal.fire({
                title: 'Fees Retrieved',
                text: `Number of returned values: ${data.length}`,
                icon: 'success',
                confirmButtonText: 'OK'
              });
            } else {
              this.fees = [];
              Swal.fire({
                title: 'No Fees Found',
                text: 'No school fees were found for the selected year.',
                icon: 'info',
                confirmButtonText: 'OK'
              });
            }
          },
          error => {
            console.error('Error fetching fees:', error);
            this.fees = [];
            this.message = 'Error fetching fees, please try again.';
            this.messageType = 'error';
          }
        );
    }
  }

  viewFeesDetails(feesId: number): void {
    this.setAdminId();
    this.http.get<any>(`http://localhost:8080/api/school-fees-details/by-fees-id?feesId=${feesId}`)
      .subscribe(
        (data) => {
          if (!data || data.length === 0) {
            Swal.fire({
              title: 'No Details Found',
              text: 'No school fees details found for this entry.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            return;
          }

          const detailsArray = Array.isArray(data) ? data : [data];
          let totalAmount = detailsArray.reduce((sum, detail) => sum + detail.amount, 0);
          let formattedTotalAmount = totalAmount.toLocaleString();

          let detailsTable = `
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
                  <tr>
                    <td class="text-start feesdetail" style="font-size: 12px !important;">${detail.id}</td>
                    <td class="text-start feesdetail" style="font-size: 12px !important;">${detail.item}</td>
                    <td class="text-start feesdetail" style="font-size: 12px !important;">${detail.description}</td>
                    <td class="text-start feesdetail" style="font-size: 12px !important;">${detail.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <h2 class="text-end mt-3">Total: ${formattedTotalAmount}</h2>
          `;

          Swal.fire({
            title: 'School Fees Details',
            html: detailsTable,
            confirmButtonText: 'Close'
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
