import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalRows: number = 0;
  studentid: number = 0;
  studentname: string = '';
  amount: number = 0;
  order_tracking_id: string = '';
  reason: string = '';
  description: string = '';
  statuscode: string = '';
  status: string = '';
  time: string = '';
  level: number = 0;
  term: string = '';
  year: number = 0;
  schooladminid: number = 0;

  private router = inject(Router);
    private paymentService = inject(PaymentService);
 data= [
  {  
      "StudentId": 1,
      "StudentName": "Aisha Namukasa",  
      "Amount": 150000,  
      "order_tracking_id": "9e937185-51a6-4137-8f17-dc3a188538e3",  
      "Reason": "School Fees",  
      "Description": "Paid Term 1 Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 08:30 AM",
      "Level": 6,  
      "Term": "Term 1",  
      "Year": 2025,
      "schoolAdminId": 1
  },
  {  
      "StudentId": 2,
      "StudentName": "Sylvia Nakato",  
      "Amount": 175000,  
      "order_tracking_id": "9e937185-51a6-4137-8fs7-dc3a188538e3",  
      "Reason": "School Fees",  
      "Description": "Paid Term 1 Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 12:15 PM",
      "Level": 6,  
      "Term": "Term 1",  
      "Year": 2025,
      "schoolAdminId": 1
  },
  {  
      "StudentId": 3,
      "StudentName": "Josephine Mirembe",  
      "Amount": 240000,  
      "order_tracking_id": "n234e4af-80a5-4ec1-8706-e03f8332fb15",  
      "Reason": "School Fees",  
      "Description": "Paid Full Year Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 12:30 PM",
      "Level": 7,  
      "Term": "Full Year",  
      "Year": 2025,
      "schoolAdminId": 2
  },
  {  
      "StudentId": 4,
      "StudentName": "Kenneth Ochieng",  
      "Amount": 210000,  
      "order_tracking_id": "o345e4af-80a5-4ec1-8706-e03f8332fb16",  
      "Reason": "School Fees",  
      "Description": "Paid Term 2 Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 12:45 PM",
      "Level": 6,  
      "Term": "Term 2",  
      "Year": 2025,
      "schoolAdminId": 3
  },
  {  
      "StudentId": 5,
      "StudentName": "Leah Naggayi",  
      "Amount": 220000,  
      "order_tracking_id": "p456e4af-80a5-4ec1-8706-e03f8332fb17",  
      "Reason": "School Fees",  
      "Description": "Paid Term 3 Fees",  
      "statusCode": "400",  
      "status": "failed",  
      "Time": "2025-01-27 01:00 PM",
      "Level": 7,  
      "Term": "Term 3",  
      "Year": 2025,
      "schoolAdminId": 1
  },
  {  
      "StudentId": 6,
      "StudentName": "Tom Kasyaba",  
      "Amount": 195000,  
      "order_tracking_id": "q567e4af-80a5-4ec1-8706-e03f8332fb18",  
      "Reason": "School Fees",  
      "Description": "Paid Registration Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 01:15 PM",
      "Level": 6,  
      "Term": "Registration",  
      "Year": 2025,
      "schoolAdminId": 2
  },
  {  
      "StudentId": 7,
      "StudentName": "Esther Okot",  
      "Amount": 270000,  
      "order_tracking_id": "r678e4af-80a5-4ec1-8706-e03f8332fb19",  
      "Reason": "School Fees",  
      "Description": "Paid Full Year Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 01:30 PM",
      "Level": 7,  
      "Term": "Full Year",  
      "Year": 2025,
      "schoolAdminId": 3
  },
  {  
      "StudentId": 8,
      "StudentName": "Emmanuel Kamya",  
      "Amount": 250000,  
      "order_tracking_id": "s789e4af-80a5-4ec1-8706-e03f8332fb20",  
      "Reason": "School Fees",  
      "Description": "Paid Term 1 Fees",  
      "statusCode": "500",  
      "status": "failed",  
      "Time": "2025-01-27 01:45 PM",
      "Level": 6,  
      "Term": "Term 1",  
      "Year": 2025,
      "schoolAdminId": 2
  },
  {  
      "StudentId": 9,
      "StudentName": "Nina Nabirye",  
      "Amount": 230000,  
      "order_tracking_id": "t890e4af-80a5-4ec1-8706-e03f8332fb21",  
      "Reason": "School Fees",  
      "Description": "Paid Term 2 Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 02:00 PM",
      "Level": 6,  
      "Term": "Term 2",  
      "Year": 2025,
      "schoolAdminId": 1
  },
  {  
      "StudentId": 10,
      "StudentName": "George Nsamba",  
      "Amount": 190000,  
      "order_tracking_id": "u901e4af-80a5-4ec1-8706-e03f8332fb22",  
      "Reason": "School Fees",  
      "Description": "Paid Term 3 Fees",  
      "statusCode": "200",  
      "status": "successful",  
      "Time": "2025-01-27 02:15 PM",
      "Level": 7,  
      "Term": "Term 3",  
      "Year": 2025,
      "schoolAdminId": 3
  }
]



transaction = [ 
  {
    studentid: this.studentid,
    studentname: this.studentname,
    amount: this.amount,
    order_tracking_id: this.order_tracking_id,
    reason: this.reason,
    description: this.description,
    statuscode: this.statuscode,
    status: this.status,
    time: this.time,
    level: this.level,
    term: this.term,
    year: this.year,
    schooladminid: this.schooladminid,
  }
];


 

  get totalPages() {
    return Math.ceil(
      this.data.filter(
        (item) =>
          item.StudentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.Reason.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).length / this.itemsPerPage
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  updateTotalRows() {
    const searchLower = this.searchQuery.toLowerCase();
    this.totalRows = this.data.filter(
      (item) =>
        item.StudentName.toLowerCase().includes(searchLower) ||
        item.Reason.toLowerCase().includes(searchLower)
    ).length;
  }
  filteredData() {
    const searchLower = this.searchQuery.toLowerCase();
    return this.data
      .filter(
        (item) =>
          item.StudentName.toLowerCase().includes(searchLower) ||
          item.Reason.toLowerCase().includes(searchLower)
      )
      .slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
  }





  // Watch for changes in the searchQuery and update total rows
  handleSearch() {
    this.currentPage = 1; // Reset to the first page
    this.updateTotalRows();
  }

  ngOnInit() {
    // Initialize total rows on component load
    this.updateTotalRows();
  }


  refresh(orderTrackingId: string): void {
    const transactionToken = localStorage.getItem('transactionToken');
    if (!transactionToken) {
      console.error('Payment token is missing. Please request a token first.');
      return;
    }
  
    this.paymentService.getTransactionStatus(orderTrackingId, transactionToken).subscribe(
      (response) => {
        console.log('Transaction status retrieved successfully------', response);
        this.data = response;
      },
      (error) => {
        console.error('Error retrieving transaction status', error.error ? error.error.message : error);
      }
   );
   
  }
  


  
  
}
