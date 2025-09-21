import { Component, OnInit } from '@angular/core';
import { MyBookings, UsersService } from '../users.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  imports: [CommonModule, DatePipe],
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent  implements OnInit {
userId: number = 0;
myBookings:MyBookings[] = [];


  constructor(private userDataService: UsersService) {
    this.userId = Number(localStorage.getItem('userId'));
   }

  ngOnInit() {
    this.loadUserBookings(this.userId);
  }
loadUserBookings(userId: number) {
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
