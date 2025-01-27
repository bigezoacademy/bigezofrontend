import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private requestTokenUrl = 'http://localhost:8080/api/pesapal/request-token';  // Modify URL as necessary
  private submitOrderUrl = 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest';  // The backend endpoint for submitting the order
  private corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy URL
  private getTransactionStatusUrl = 'https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId='; // Backend endpoint for transaction status

  constructor(private http: HttpClient) {}

  /**
   * Requests a payment token from the server.
   * @returns An Observable containing the payment token and its details.
   */
  requestPaymentToken(): Observable<any> {
    const headers = new HttpHeaders().set('X-API-KEY', environment.pesapalApiKey);

    return this.http.post(this.requestTokenUrl, {}, { headers });
  }

  /**
   * Submits a payment order to the backend via a CORS proxy.
   * @param paymentToken The JWT token for authorization.
   * @param paymentBody The payment details to be sent to the backend.
   * @returns An Observable containing the response from the backend.
   */
  submitPayment(paymentToken: string, paymentBody: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${paymentToken}`)
      .set('Content-Type', 'application/json');

    // Prepend CORS proxy URL to the target URL
    const fullUrl = this.corsProxyUrl + this.submitOrderUrl;

    return this.http.post(fullUrl, paymentBody, { headers });
  }


  /**
   * Fetches the transaction status using the provided orderTrackingId.
   * @param orderTrackingId The unique identifier for the transaction.
   * @returns An Observable containing the transaction status.
   */
  getTransactionStatus(orderTrackingId: string, paymentToken: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${paymentToken}`)
      .set('Content-Type', 'application/json');
  
    // Use CORS proxy for the GetTransactionStatus URL
    const fullUrl = `${this.corsProxyUrl}${this.getTransactionStatusUrl}${orderTrackingId}`;
  
    return this.http.get(fullUrl, { headers });
  }
  
  
}
