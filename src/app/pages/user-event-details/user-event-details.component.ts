import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventModel, EventService } from 'src/app/event-create-modal/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-event-details',
  templateUrl: './user-event-details.component.html',
  styleUrls: ['./user-event-details.component.scss'],
  standalone: true,
   imports: [CommonModule], 
})
export class UserEventDetailsComponent  implements OnInit {
   event?: EventModel;
    leftImages: string[] = [];
    rightImage: string | null = null;
     eventId: string | null = null;
  constructor(private eventDataService: EventService,private navCtrl: NavController, private route: ActivatedRoute) { }

  ngOnInit(): void {
     // Get :id from route
     // Get :id from route
  this.eventId = this.route.snapshot.paramMap.get('id');

  if (!this.eventId) {
    // If no id, redirect to event listing
    this.navCtrl.navigateRoot(['/event']);
    return;
  }

  // Fetch event either from service or API
  this.eventDataService.selectedEvent$.subscribe(event => {
    // If event is not loaded or does not match the route param, fetch from API
    if (!event || event.id.toString() !== this.eventId) {
      this.eventDataService.getEventById(+this.eventId!).subscribe(
        data => {
          this.event = data;

          // Save for later use
          this.eventDataService.setSelectedEvent(data);
          localStorage.setItem('selectedEvent', JSON.stringify(data));

          this.prepareImages();
        },
        err => {
          console.error('Error fetching event by ID:', err);
          this.navCtrl.navigateRoot(['/event']);
        }
      );
    } else {
      this.event = event;
      this.prepareImages();
    }
  });
  }

  // Helper function to process images
private prepareImages(): void {
  if (this.event?.imagesPath) {
    const baseUrl = 'https://localhost:7129/';
    const images = this.event.imagesPath.split(',');
    this.leftImages = images.slice(0, images.length - 1).map(img => baseUrl + img.trim());
    this.rightImage = images.length ? baseUrl + images[images.length - 1].trim() : null;
  }
}
  private isPageReloaded(): boolean {
    // Works in most browsers
    return (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) ||
           performance.getEntriesByType('navigation')
                      .some((nav: any) => nav.type === 'reload');
  }
  closeDetails(): void {
    this.eventDataService.setSelectedEvent(null);
  }
  goToDetails() {
    
  this.navCtrl.navigateForward(['/event-checkoutme']);
}

}
