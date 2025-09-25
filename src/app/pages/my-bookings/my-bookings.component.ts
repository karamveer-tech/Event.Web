import { Component, OnInit } from '@angular/core';
import { MyBookings, UsersService } from '../users.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { CONFIG } from 'src/app/confiq/confiq';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  standalone: true,  
  imports: [CommonModule, RouterModule, QRCodeComponent, DatePipe],
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  userId: number = 0;
  myBookings: MyBookings[] = [];
  eventPath: string = '';
  selectedEventId: number | null = null;

  constructor(private userDataService: UsersService, private router: Router) {}

  ngOnInit() {
    // Get logged-in user
    const userIdStored = localStorage.getItem('userId');
    if (userIdStored) {
      this.userId = Number(userIdStored);
      this.loadUserBookings(this.userId);
    }

    // Get selected event from localStorage (optional)
    const storedEvent = localStorage.getItem('selectedEvent');
    if (storedEvent) {
      const eventObj = JSON.parse(storedEvent);
      this.selectedEventId = eventObj?.id || null;
    }

    this.eventPath = CONFIG.baseUrlForQR;
  }

  loadUserBookings(userId: number) {
    this.userDataService.loadUserBookings(userId).subscribe({
      next: (res) => {
        this.myBookings = res;
      },
      error: (err) => {
        console.error('Failed to load user bookings', err);
      }
    });
  }

  viewEventDetails(eventId: number) {
    // Navigate to user-event-details page when clicking an event
    this.router.navigate(['/user-event-details', eventId]);
  }

  shareEventDetails(eventId: number) {
    // Example sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Event Details',
        text: `Check out this event with ID: ${eventId}`,
        url: `${window.location.origin}/user-event-details/${eventId}`
      }).catch((err) => console.error('Share failed:', err));
    } else {
      alert(`Share this URL: ${window.location.origin}/user-event-details/${eventId}`);
    }
  }
}
