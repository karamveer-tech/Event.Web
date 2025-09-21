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
     if (this.isPageReloaded()) {
      // Redirect only on browser refresh / direct URL reload
       window.location.href = '/event';
    }
    this.eventDataService.selectedEvent$.subscribe(event => {
      
      this.event = event || undefined;
      if (this.event?.imagesPath) {
        //const baseUrl = 'https://localhost:7129/';
        const baseUrl = 'http://148.113.192.114:5000/';
        const images = this.event?.imagesPath.split(',');
         localStorage.setItem('selectedEvent', JSON.stringify(this.event));
        this.leftImages = images.slice(0, images.length - 1).map(img => baseUrl + img.trim());
        this.rightImage = images.length ? baseUrl + images[images.length - 1].trim() : null;
      }
    });
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
