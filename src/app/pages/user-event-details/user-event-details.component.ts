import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventModel, EventService } from 'src/app/event-create-modal/event.service';
import { Router } from '@angular/router';
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
  constructor(private eventDataService: EventService,private navCtrl: NavController) { }

  ngOnInit(): void {
    this.eventDataService.selectedEvent$.subscribe(event => {
      debugger
      this.event = event || undefined;
      if (this.event?.imagesPath) {
    const baseUrl = 'https://localhost:7129/';
    const images = this.event?.imagesPath.split(',');

    this.leftImages = images.slice(0, images.length - 1).map(img => baseUrl + img.trim());
    this.rightImage = images.length ? baseUrl + images[images.length - 1].trim() : null;
  }
    });
  }
  closeDetails(): void {
    this.eventDataService.setSelectedEvent(null);
  }
  goToDetails() {
  this.navCtrl.navigateForward(['/event-checkoutme']);
}

}
