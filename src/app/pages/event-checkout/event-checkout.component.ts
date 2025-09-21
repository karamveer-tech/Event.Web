import { Component, OnInit } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking, BookingTicket, UsersModel, UsersService } from '../users.service';
import { EventModel } from 'src/app/event-create-modal/event.service';



@Component({
  selector: 'app-event-checkout',
  templateUrl: './event-checkout.component.html',
  styleUrls: ['./event-checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CurrencyPipe]
})
export class EventCheckoutComponent implements OnInit {

  // user: UsersModel = {
  // name: '',
  // email: '',
  // phone: ''
  // };
  user: UsersModel | undefined;
  booking: Booking =
    {
      id: 0,
      user_id: 0,
      event_id: 0,
      booking_date: new Date(),
      status: '',
      emailId: '',
      total_amount: 0,
      quantity: 0,
      BookingTickets: []
    };
  BookingTickets: BookingTicket = {
    id: 0,
    booking_id: 0,
    ticket_type: '',
    quantity: 0,
    price: 0
  };
  event: EventModel = {
    id: 0,
    title: '',
    description: '',
    location: '',
    address: '',
    start_datetime: '',
    end_datetime: '',
    banner_path: '',
    ticketType: 'Free',
    freeSeats: null,
    paidTickets: [],
    banner: null,
    images: [],
    status: 'Draft',
    lat: 0,
    lng: 0
  };
  billing = {
    fullName: '',
    email: '',
    phone: '',
    address: ''
  };

  promoCode: string = '';
  selectedPayment: string = 'card';
  card = {
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    save: false
  };
  selectedTicket: string = '';
  ticketQuantity: number = 1;
  eventName: string = 'Learning Conference -2023';
  eventDate: string = 'FRI, FEB 15 2023';
  ticketPrice: number = 100;
  payAmount: number = 0;
  loading: boolean = true;
  ticketTypes = [
    { id: 'standard', name: 'Standard' },
    { id: 'vip', name: 'VIP' }
  ];

  isLoggedIn: boolean = false;
  userRole: string = '';
  userEmail: string = '';
  additionalTickets: Array<{ type: string; quantity: number }> = [];
  availableTickets: number = 0;
  quantity: number = 0;
  totalBookedTicketCount: number = 0;

  constructor(public router: Router, private userDataService: UsersService) { }

  ngOnInit() {
    
    if (this.isPageReloaded()) {
      window.location.href = '/event';
    }
    

    this.event = JSON.parse(localStorage.getItem('selectedEvent') || '{}');
    this.getBookedTicketsCount(this.event.id);
    this.calculatePayAmount();
    setTimeout(() => this.loading = false, 500);
    this.loadUser();
    var userId = Number(localStorage.getItem('userId'));
    this.getUserDetails(userId);

  }
  private isPageReloaded(): boolean {
    // Works in most browsers
    return (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) ||
      performance.getEntriesByType('navigation')
        .some((nav: any) => nav.type === 'reload');
  }
  get isFreeTicket(): boolean {
    return this.event?.ticketType === 'Free';
  }
  loadUser(): void {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('role');
    var email = localStorage.getItem('username');
    this.userRole = role || '';
    this.userEmail = email || '';
    this.isLoggedIn = !!token;
  }
  getUserDetails(userId: any): void {
    this.userDataService.getUserById(userId).subscribe(res => {
      
      if (res && Array.isArray(res) && res.length > 0) {
        this.user = res[0];   // take the first element from the array
      } else {
        this.user = undefined;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.isLoggedIn = false;
    this.userRole = '';
    this.userEmail = '';
    // Optionally, redirect to login or homepage
  }
  onBillingSubmit() {
    // Handle billing form submission
  }
  login(): void {
    window.location.href = '/login';
  }
  applyPromo() {
    // Handle promo code application
  }

  selectPayment(method: string) {
    this.selectedPayment = method;
  }

  confirmPayment() {
    let pricePerSeat = 0;
    let totalAmount = 0;
    
    if (this.event.ticketType === 'Paid' && this.event.paidTickets?.length) {
      pricePerSeat = this.event.paidTickets[0].price ?? 0;  // take first paid ticket price
      totalAmount = this.quantity * pricePerSeat;
    }
    this.booking = {
      user_id: Number(localStorage.getItem('userId')),
      event_id: this.event.id,
      booking_date: new Date(),
      status: 'Confirmed',
      emailId: this.userEmail,
      total_amount: totalAmount,
      quantity: this.quantity,
      BookingTickets: [
        {
          ticket_type: this.event.ticketType,
          quantity: this.quantity,
          price: this.event.ticketType === 'Paid' && this.event.paidTickets?.length
            ? this.event.paidTickets[0].price : 0
        }
      ]
    };

    this.userDataService.bookNow(this.booking).subscribe({
      next: (res) => {
        alert('Booking successful!');

        this.router.navigate(['/myBookings']);
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert('Booking failed!');
      }
    });
  }

  addMoreTicketType() {
    this.additionalTickets.push({ type: '', quantity: 1 });
  }

  calculatePayAmount() {
    // Calculate total pay amount
    let total = this.ticketQuantity * this.ticketPrice;
    for (const extra of this.additionalTickets) {
      total += (extra.quantity || 0) * this.ticketPrice;
    }
    this.payAmount = total;
  }

  getBookedTicketsCount(eventId: number): void {
    this.totalBookedTicketCount = 0;
    this.userDataService.getBookedTicketsCount(eventId).subscribe({
      next: (res) => {
       
        this.totalBookedTicketCount = res;
        let freeSeats = this.event.freeSeats ?? 0;
        this.availableTickets = freeSeats - this.totalBookedTicketCount;
      }
    });
  }

}
