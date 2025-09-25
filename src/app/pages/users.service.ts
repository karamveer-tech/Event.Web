import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CONFIG } from '../confiq/confiq';

export interface BookingTicket {
  id?: number;
  ticket_type_id?: number;
  ticket_type_name?: string;
  quantity: number;
  ticket_price?: number;
}

export interface Booking {
  id?: number;
  user_id: number;
  event_id: number;
  booking_date: Date;
  status: string;
  emailId?: string;
  total_amount: number;
  quantity: number;
  bookingTicketsJson?: string;  // JSON string for API
  BookingTickets?: BookingTicket[]; // local use
}

export interface UsersModel {
 id?: number;
  name?: string;
  email?: string;
  phone?: string;
  role_id?: number;
  role_name?: string;
  status?: number;
  created_at?: string;
  token?: string;
  password_hash?: string;
}


export interface MyBookings {
  id: number;
  user_id: number;
  event_id: number;
  quantity: number;
  booking_date: string;         // DateTime → string (ISO format)
  status: string;
  total_amount: number;
  organiser_id: number;
  title: string;
  description?: string;
  location?: string;
  banner_path: string;
  imagesPath: string;
  csvFile_path: string;
  start_datetime: string;
  end_datetime: string;
  ticketType: string;           // "Free" or "Paid"
  freeSeats: number;
  banner?: File;                // IFormFile → File
  images?: File[];
  paidTicketsJson: string;
  paidTickets?: PaidTicket[];
  created_at: string;
}

export interface PaidTicket {
    id?: number;
    name: string;
    seats: number | null;
    price: number | null;
}

export interface EventModel {
    id: number;
    title: string;
    description?: string;
    location?: string;
    address?: string;
    start_datetime: string;
    end_datetime: string;
    banner_path: string;
    ticketType: 'Free' | 'Paid';
    freeSeats?: number | null;
    paidTickets?: PaidTicket[];
    banner?: File | null;
    images?: File[];
    imagesPath?: string;
    status: 'Draft' | 'Published';
    lat?: number;  // use type only
    lng?: number;  // use type only
    // csvFile?: File | null;
}

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private http: HttpClient) { }
  
   getUserByEmail(email: string): Observable<UsersModel> {
          return this.http.get<UsersModel>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_USER_DETAILS_BY_EMAIL}?emailId=${encodeURIComponent(email)}`);
      }
   getUserById(userId: number): Observable<UsersModel> {
          return this.http.get<UsersModel>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_USER_DETAILS_BY_ID}?userId=${userId}`);
      }

    bookNow(booking: Booking): Observable<UsersModel> {
      const formData = new FormData();

      formData.append('user_id', booking.user_id.toString());
      formData.append('event_id', booking.event_id.toString());
      formData.append('booking_date', new Date(booking.booking_date).toISOString());
      formData.append('status', booking.status || '');
      formData.append('total_amount', booking.total_amount.toString());
      formData.append('quantity', booking.quantity.toString());
      formData.append('emailId', booking.emailId || '');

    if (booking.BookingTickets && booking.BookingTickets.length > 0) {
      formData.append('bookingTicketsJson', JSON.stringify(booking.BookingTickets));
    }
    
           return this.http.post(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.BOOK_EVENT}`,formData);
      }

      getBookedTicketsCount(eventId: number): Observable<number> {
        return this.http.get<number>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_BOOKED_TICKETS_COUNT}?eventId=${eventId}`);
    }
    loadUserBookings(userId: number): Observable<any> {
        return this.http.get<any>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_MY_BOOKINGS}?userId=${userId}`);
    }
    getApiVersion(): Observable<string> {
      return this.http.get(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_API_VERSION}`, { responseType: 'text' });
  }
}
