import { Component, OnInit } from '@angular/core';
import { MyBookings, UsersService } from '../users.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { CONFIG } from 'src/app/confiq/confiq';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  standalone: true,  
  imports: [CommonModule,RouterModule, QRCodeComponent,DatePipe],
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent  implements OnInit {
userId: number = 0;
myBookings:MyBookings[] = [];
eventPath: string = '';
eventId: number = 0;

  constructor(private userDataService: UsersService) {
    this.userId = Number(localStorage.getItem('userId'));
    const storedEvent = localStorage.getItem("selectedEvent");

if (storedEvent) {
  const eventObj = JSON.parse(storedEvent);
  this.eventId = eventObj.id;

}
   }

  ngOnInit() {
    this.loadUserBookings(this.userId);
    this.eventPath=CONFIG.baseUrlForQR;
  }
loadUserBookings(userId: number) {
  debugger
    this.userDataService.loadUserBookings(userId).subscribe({
      next: (res) => {
        this.myBookings = res;
        console.log('User Details:', res);
      },
      error: (err) => {
        console.error('Failed to load user details', err);
      }
    });
  }

  shareEventDetails(eventId: number) {
    // const shareData = {
    //   title: 'Event Details',
    //   text: `Check out the details for event ID: ${eventId}`,
    //   url: window.location.href // You can customize this URL
    }
}
