import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments'; // Update this with your backend URL
  private apiUrl2 = 'http://localhost:8080/api/pesapal/request-token'; // Adjust the URL to match your backend

  constructor(private http: HttpClient) {}

submitPayment(orderRequest: any): Observable<string> {
  return this.http.post<string>(`${this.apiUrl}/submit`, orderRequest).pipe(
    catchError((error) => {
      console.error('Payment submission failed', error);
      return throwError(error); // Propagate the error
    })
  );
}

  getPaymentStatus(orderTrackingId: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8080/api/pesapal/transaction-status?orderTrackingId=${orderTrackingId}`);
  }




  getPesapalToken(): Observable<any> {
    return this.http.post<any>(this.apiUrl2, {}, { headers: { skipInterceptor: 'true' } });
  }
  
}
