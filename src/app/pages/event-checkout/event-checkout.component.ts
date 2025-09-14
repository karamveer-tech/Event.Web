import { Component, OnInit } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-event-checkout',
  templateUrl: './event-checkout.component.html',
  styleUrls: ['./event-checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CurrencyPipe]
})
export class EventCheckoutComponent  implements OnInit {

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
  availableTickets: number = 100;
  eventDate: string = 'FRI, FEB 15 2023';
  ticketPrice: number = 100;
  payAmount: number = 0;
  loading: boolean = true;
  ticketTypes = [
    { id: 'standard', name: 'Standard' },
    { id: 'vip', name: 'VIP' }
  ];
  additionalTickets: Array<{ type: string; quantity: number }> = [];

  constructor() { }

  ngOnInit() {
  this.calculatePayAmount();
  setTimeout(() => this.loading = false, 500);
  }

  onBillingSubmit() {
    // Handle billing form submission
  }

  applyPromo() {
    // Handle promo code application
  }

  selectPayment(method: string) {
    this.selectedPayment = method;
  }

  confirmPayment() {
    // Handle payment confirmation
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

}
