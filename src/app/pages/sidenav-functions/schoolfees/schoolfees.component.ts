import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SchoolFeesSetting } from '../../../school-fees-setting.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  schoolName: string = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('schoolName') : 'School Name') || 'School Name';
  adminId: string = '';

  accounttype: any = (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('Role') : null);

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const getLS = (key: string) => (typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem(key) : null);
    const clearLS = () => { if (typeof window !== 'undefined' && window.localStorage) window.localStorage.clear(); };
    const token = getLS('Token');
    if (!token) {
      clearLS();
      if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.clear();
      this.router.navigateByUrl('');
    }
  }

  displayExistingFees(): void {
    this.setAdminId();
    if (this.adminId) {
      //this.http.get<SchoolFeesSetting[]>(`https://bigezo-production.up.railway.app/api/school-fees-settings/find-by-year-and-admin?year=${this.myyear}&schoolAdminId=${this.adminId}`)
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
    //this.http.get<any>(`https://bigezo-production.up.railway.app/api/school-fees-details/by-fees-id?feesId=${feesId}`)
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

          // Add an id to the table container for PDF export
          let detailsTable = `
          <div id="fees-details-table-modal">
            <h2 class="text-center mb-2">${this.schoolName}</h2>
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
          </div>
          `;

          // Add a Download PDF button next to Close
          Swal.fire({
            html: `
            <div style="overflow-x:auto;">
              <div class="table-responsive">
                ${detailsTable}
              </div>
            </div>
            <div class="d-flex justify-content-end mt-3">
              <button id="download-pdf-btn" class="btn btn-primary me-2">Download PDF</button>
              <button id="close-modal-btn" class="btn btn-secondary">Close</button>
            </div>
            `,
            showConfirmButton: false,
            width: '90vw',
            customClass: {
              popup: 'swal-wide-table'
            },
            didOpen: () => {
              const closeBtn = document.getElementById('close-modal-btn');
              if (closeBtn) {
                closeBtn.addEventListener('click', () => Swal.close());
              }
              const downloadBtn = document.getElementById('download-pdf-btn');
              if (downloadBtn) {
                downloadBtn.addEventListener('click', () => this.downloadFeesDetailsPDF());
              }
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

  downloadFeesDetailsPDF(): void {
    const tableElement = document.getElementById('fees-details-table-modal');
    if (!tableElement) return;
    html2canvas(tableElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      // Calculate image dimensions to fit page
      const imgProps = pdf.getImageProperties(imgData);
      let pdfWidth = pageWidth - 20;
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      if (pdfHeight > pageHeight - 20) {
        pdfHeight = pageHeight - 20;
        pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;
      }
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save('fees-details.pdf');
    });
  }

  deleteFeesDetails(feesId: number, feesYear: string, feesLevel: string, feesTerm: string): void {
    this.setAdminId();
    console.log(`Deleting fees details for feesId: ${feesId}, year: ${feesYear}, level: ${feesLevel}, term: ${feesTerm}`);
    
    //this.http.delete(`https://bigezo-production.up.railway.app/api/school-fees-details/by-fees-id?feesId=${feesId}`)
    this.http.delete(`http://localhost:8080/api/school-fees-details/by-fees-id?feesId=${feesId}`)
      .subscribe({
        next: () => {
          Swal.fire('Fees details deleted successfully');
          // Reload the entries in the UI
          this.displayExistingFees();
        },
        error: (error) => {
          console.error('Error deleting fees details:', error);
          // Handle the error appropriately
        }
      });
  }

  private setAdminId(): void {
    if (this.accounttype === 'ROLE_ADMIN') {
      this.adminId = localStorage.getItem('id') || '';
    } else if (this.accounttype === 'ROLE_USER') {
      this.adminId = localStorage.getItem('schoolAdminId') || '';
    }
  }
}
