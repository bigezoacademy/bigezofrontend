import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://bigezobackend2025-production.up.railway.app/api/payments'; // Update this with your backend URL
  private apiUrl2 = 'https://bigezobackend2025-production.up.railway.app/api/pesapal/request-token'; // Adjust the URL to match your backend

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
    return this.http.get<string>(`https://bigezobackend2025-production.up.railway.app/api/pesapal/transaction-status?orderTrackingId=${orderTrackingId}`);
  }

  /**
   * Makes a payment request to the backend. This method builds the payment body using dynamic and static fields.
   * @param options Object containing dynamic fields: amount, description, and any overrides.
   */
  makePayment(options: {
    amount: number,
    description: string,
    id?: string, // Optional override for transaction id
    callback_url?: string,
    redirect_mode?: string,
    notification_id?: string,
    branch?: string,
    extraFields?: any // For any additional/override fields
  }): Observable<any> {
    // Generate a random 12-character alphanumeric ID with dashes if not provided
    const randomId = options.id || Array(12)
      .fill(0)
      .map((_, i) => (i === 4 || i === 9 ? '-' : Math.random().toString(36).charAt(2)))
      .join('');

    // Get values from localStorage
    const studentId = Number(localStorage.getItem('id'));
    const schoolAdminId = Number(localStorage.getItem('schoolAdminId'));
    const email_address = localStorage.getItem('email') || 'student@example.com';
    const phone_number = localStorage.getItem('phone') || '0704678948';
    const first_name = localStorage.getItem('firstName') || 'John';
    const middle_name = localStorage.getItem('middleName') || '';
    const last_name = localStorage.getItem('lastName') || 'Doe';
    const line_1 = localStorage.getItem('address1') || '123 Main Street';
    const line_2 = localStorage.getItem('address2') || '';
    const city = localStorage.getItem('city') || 'Kampala';
    const state = localStorage.getItem('state') || '';
    const postal_code = localStorage.getItem('postalCode') || '';
    const zip_code = localStorage.getItem('zipCode') || '';
    const notification_id = options.notification_id || localStorage.getItem('notification_id') || '5bbe0e70-32aa-4204-b00b-dc4bd606fa7f';
    const branch = options.branch || localStorage.getItem('branch') || 'Store Name - HQ';

    const paymentInfo: any = {
      id: randomId,
      currency: 'UGX',
      amount: options.amount,
      description: options.description,
      callback_url: options.callback_url || 'http://localhost:4200/payment-callback',
      redirect_mode: options.redirect_mode || 'iframe',
      notification_id: notification_id,
      branch: branch,
      billing_address: {
        email_address,
        phone_number,
        country_code: 'UG',
        first_name,
        middle_name,
        last_name,
        line_1,
        line_2,
        city,
        state,
        postal_code,
        zip_code
      },
      school_admin_id: schoolAdminId,
      student_id: studentId
    };

    // Merge any extra/override fields
    if (options.extraFields) {
      Object.assign(paymentInfo, options.extraFields);
    }

    return this.http.post(this.apiUrl, paymentInfo).pipe(
      catchError((error) => {
        // If the backend returns an error response, propagate it to the component
        return throwError(error);
      })
    );
  }

  getPesapalToken(): Observable<any> {
    return this.http.post<any>(this.apiUrl2, {}, { headers: { skipInterceptor: 'true' } });
  }
  
}
