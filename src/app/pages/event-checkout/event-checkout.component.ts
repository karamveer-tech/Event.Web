import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Booking, BookingTicket, UsersModel, UsersService } from '../users.service';
import { EventModel, PaidTicket } from 'src/app/event-create-modal/event.service';

@Component({
  selector: 'app-event-checkout',
  templateUrl: './event-checkout.component.html',
  styleUrls: ['./event-checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CurrencyPipe]
})
export class EventCheckoutComponent implements OnInit {

  user: UsersModel | undefined;

  booking: Booking = {
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
  eventName: string = '';
  eventDate: string = '';
  ticketPrice: number = 0;
  payAmount: number = 0;
  loading: boolean = true;
quantity: number = 0;
  ticketTypes = [
    { id: 'standard', name: 'Standard' },
    { id: 'vip', name: 'VIP' }
  ];

  isLoggedIn: boolean = false;
  userRole: string = '';
  userEmail: string = '';
  additionalTickets: Array<{ type: string; quantity: number }> = [];
  availableTickets: number = 0;
  totalBookedTicketCount: number = 0;

  constructor(public router: Router, private userDataService: UsersService) {}

  ngOnInit() {
    // Redirect if page reload
    if (this.isPageReloaded()) {
      window.location.href = '/event';
    }

    // Load selected event
    const storedEvent = localStorage.getItem('selectedEvent');
    if (storedEvent) {
      this.event = JSON.parse(storedEvent);
      this.eventName = this.event.title;
      this.eventDate = this.event.start_datetime;
      this.ticketPrice = this.event.paidTickets?.[0]?.price ?? 0;
      this.getBookedTicketsCount(this.event.id);
      this.calculatePayAmount();
    }

    this.loadUser();
    const userId = Number(localStorage.getItem('userId'));
    this.getUserDetails(userId);

    setTimeout(() => this.loading = false, 500);
  }

  private isPageReloaded(): boolean {
    return (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) ||
      performance.getEntriesByType('navigation').some((nav: any) => nav.type === 'reload');
  }

  get isFreeTicket(): boolean {
    return this.event?.ticketType === 'Free';
  }

  loadUser(): void {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('username');
    this.userRole = role || '';
    this.userEmail = email || '';
    this.isLoggedIn = !!token;
  }

  getUserDetails(userId: number): void {
    this.userDataService.getUserById(userId).subscribe(res => {
      this.user = Array.isArray(res) && res.length > 0 ? res[0] : undefined;
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    this.isLoggedIn = false;
    this.userRole = '';
    this.userEmail = '';
  }

  onBillingSubmit() {
    // Handle billing form submission
  }

  login(): void {
    window.location.href = '/login';
  }

  applyPromo() {
    // Handle promo code
  }

  selectPayment(method: string) {
    this.selectedPayment = method;
  }

confirmPayment() {
  if (!this.event) {
    alert('Event not loaded!');
    return;
  }

  // Prepare main ticket
  const mainTicket: BookingTicket = {
    ticket_type_id: Number(this.selectedTicket), // convert string to number
    ticket_type_name: this.selectedTicket,      // you can replace with actual name if available
    quantity: this.quantity,
    ticket_price: this.event.ticketType === 'Paid' && this.event.paidTickets?.length
      ? this.event.paidTickets[0].price ?? 0
      : 0
  };

  // Prepare additional tickets
  const additional: BookingTicket[] = this.additionalTickets.map(t => ({
    ticket_type_id: Number(t.type), // convert type id to number
    ticket_type_name: t.type,
    quantity: t.quantity,
    ticket_price: this.ticketPrice
  }));

  const tickets: BookingTicket[] = [mainTicket, ...additional];

  // const totalAmount = tickets.reduce((sum, t) => sum + (t.quantity * t.ticket_price), 0);
  this.booking = {
    user_id: Number(localStorage.getItem('userId')),
    event_id: this.event.id,
    booking_date: new Date(),
    status: 'Confirmed',
    emailId: this.userEmail,
    total_amount: 0,
    quantity: this.ticketQuantity,
    BookingTickets: tickets,
    bookingTicketsJson: JSON.stringify(tickets) // required by backend
  };

  // Call booking API
  this.userDataService.bookNow(this.booking).subscribe({
    next: res => {
      alert('Booking successful!');
      this.router.navigate(['/myBookings']);
      
    },
    error: err => {
      console.error('Booking failed', err);
      alert('Booking failed!');
    }
  });
}



  addMoreTicketType() {
    this.additionalTickets.push({ type: '', quantity: 1 });
  }

  calculatePayAmount() {
    let total = this.ticketQuantity * (this.event.paidTickets?.[0]?.price ?? 0);
    for (const extra of this.additionalTickets) {
      const ticketPrice = this.event.paidTickets?.find(t => t.name === extra.type)?.price ?? 0;
      total += (extra.quantity || 0) * ticketPrice;
    }
    this.payAmount = total;
  }

  getBookedTicketsCount(eventId: number): void {
    this.userDataService.getBookedTicketsCount(eventId).subscribe({
      next: res => {
        
        this.totalBookedTicketCount = res;
        const freeSeats = this.event.freeSeats ?? 0;
        this.availableTickets = freeSeats - this.totalBookedTicketCount;
      }
    });
  }

}
