import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  data = [
     
      {  
          "StudentName": "Aisha Namukasa",  
          "Amount": 150000,  
          "order_tracking_id": "b945e4af-80a5-4ec1-8706-e03f8332fb04",  
          "Reason": "School Fees",  
          "Description": "Paid Term 1 Fees",  
          "status": "200",  
          "Time": "2025-01-27 08:30 AM"  
      },  
      {  
          "StudentName": "John Okello",  
          "Amount": 300000,  
          "order_tracking_id": "c123e4af-80a5-4ec1-8706-e03f8332fb04",  
          "Reason": "School Fees",  
          "Description": "Paid Full Year Fees",  
          "status": "200",  
          "Time": "2025-01-27 09:00 AM"  
      },  
      {  
          "StudentName": "Mary Nansubuga",  
          "Amount": 200000,  
          "order_tracking_id": "d456e4af-80a5-4ec1-8706-e03f8332fb05",  
          "Reason": "School Fees",  
          "Description": "Paid Term 2 Fees",  
          "status": "200",  
          "Time": "2025-01-27 09:30 AM"  
      },  
      {  
          "StudentName": "Samuel Kiwalabye",  
          "Amount": 250000,  
          "order_tracking_id": "e789e4af-80a5-4ec1-8706-e03f8332fb06",  
          "Reason": "School Fees",  
          "Description": "Paid Term 3 Fees",  
          "status": "200",  
          "Time": "2025-01-27 10:00 AM"  
      },  
      {  
          "StudentName": "Fatima Alimansi",  
          "Amount": 180000,  
          "order_tracking_id": "f012e4af-80a5-4ec1-8706-e03f8332fb07",  
          "Reason": "School Fees",  
          "Description": "Paid Registration Fees",  
          "status": "200",  
          "Time": "2025-01-27 10:15 AM"  
      },  
      {  
          "StudentName": "David Kato",  
          "Amount": 220000,  
          "order_tracking_id": "g345e4af-80a5-4ec1-8706-e03f8332fb08",  
          "Reason": "School Fees",  
          "Description": "Paid Term 1 Fees",  
          "status": "200",  
          "Time": "2025-01-27 10:30 AM"  
      },  
      {  
          "StudentName": "Grace Nankya",  
          "Amount": 160000,  
          "order_tracking_id": "h678e4af-80a5-4ec1-8706-e03f8332fb09",  
          "Reason": "School Fees",  
          "Description": "Paid Term 2 Fees",  
          "status": "200",  
          "Time": "2025-01-27 10:45 AM"  
      },  
      {  
          "StudentName": "Peter Muwanguzi",  
          "Amount": 270000,  
          "order_tracking_id": "i901e4af-80a5-4ec1-8706-e03f8332fb10",  
          "Reason": "School Fees",  
          "Description": "Paid Full Year Fees",  
          "status": "200",  
          "Time": "2025-01-27 11:00 AM"  
      },  
      {  
          "StudentName": "Sarah Nansubuga",  
          "Amount": 190000,  
          "order_tracking_id": "j234e4af-80a5-4ec1-8706-e03f8332fb11",  
          "Reason": "School Fees",  
          "Description": "Paid Term 3 Fees",  
          "status": "200",  
          "Time": "2025-01-27 11:15 AM"  
      },  
      {  
          "StudentName": "Isaac Kiggundu",  
          "Amount": 300000,  
          "order_tracking_id": "k567e4af-80a5-4ec1-8706-e03f8332fb12",  
          "Reason": "School Fees",  
          "Description": "Paid Full Year Fees",  
          "status": "200",  
          "Time": "2025-01-27 11:30 AM"  
      },  
      {  
          "StudentName": "Lydia Nandawula",  
          "Amount": 140000,  
          "order_tracking_id": "l890e4af-80a5-4ec1-8706-e03f8332fb13",  
          "Reason": "School Fees",  
          "Description": "Paid Term 1 Fees",  
          "status": "200",  
          "Time": "2025-01-27 11:45 AM"  
      },  
      {  
          "StudentName": "Brian Ssemakula",  
          "Amount": 230000,  
          "order_tracking_id": "m123e4af-80a5-4ec1-8706-e03f8332fb14",  
          "Reason": "School Fees",  
          "Description": "Paid Term 2 Fees",  
          "status": "200",  
          "Time": "2025-01-27 12:00 PM"  
      },  
      {  
          "StudentName": "Esther Mugisha",  
          "Amount": 210000,  
          "order_tracking_id": "n456e4af-80a5-4ec1-8706-e03f8332fb15",  
          "Reason": "School Fees",  
          "Description": "Paid Term 3 Fees",  
          "status": "200",  
          "Time": "2025-01-27 12:15 PM"  
      },  
      {  
          "StudentName": "Michael Obote",  
          "Amount": 175000,  
          "order_tracking_id": "o789e4af-80a5-4ec1-8706-e03f8332fb16",  
          "Reason": "School Fees",  
          "Description": "Paid Registration Fees",  
          "status": "200",  
          "Time": "2025-01-27 12:30 PM"  
      },  
      {  
          "StudentName": "Nina Kiggundu",  
          "Amount": 195000,  
          "order_tracking_id": "p012e4af-80a5-4ec1-8706-e03f8332fb17",  
          "Reason": "School Fees",  
          "Description": "Paid Term 1 Fees",  
          "status": "200",  
          "Time": "2025-01-27 12:45 PM"  
      },  
      {  
          "StudentName": "Tom Muwanga",  
          "Amount": 280000,  
          "order_tracking_id": "q345e4af-80a5-4ec1-8706-e03f8332fb18",  
          "Reason": "School Fees",  
          "Description": "Paid Full Year Fees",  
          "status": "200",  
          "Time": "2025-01-27 01:00 PM"  
      },  
      {  
          "StudentName": "Diana Kanyange",  
          "Amount": 165000,  
          "order_tracking_id": "r678e4af-80a5-4ec1-8706-e03f8332fb19",  
          "Reason": "School Fees",  
          "Description": "Paid Term 2 Fees",  
          "status": "200",  
          "Time": "2025-01-27 01:15 PM"  
      },  
      {  
          "StudentName": "Victor Nsubuga",  
          "Amount": 240000,  
          "order_tracking_id": "s901e4af-80a5-4ec1-8706-e03f8332fb20",  
          "Reason": "School Fees",  
          "Description": "Paid Term 3 Fees",  
          "status": "200",  
          "Time": "2025-01-27 01:30 PM"  
      }  
  
  ];

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





  // Watch for changes in the searchQuery and update total rows
  handleSearch() {
    this.currentPage = 1; // Reset to the first page
    this.updateTotalRows();
  }

  ngOnInit() {
    // Initialize total rows on component load
    this.updateTotalRows();
  }
  refresh(orderTrackingId: string) {
    alert(`Refreshing data for Order Tracking ID: ${orderTrackingId}`);
    // Here, you can add logic to refresh data, e.g., fetch updated details from a backend API.
  }
}
