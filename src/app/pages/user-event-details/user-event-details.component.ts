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

  constructor(private eventDataService: EventService,private navCtrl: NavController) { }

  ngOnInit(): void {
    this.eventDataService.selectedEvent$.subscribe(event => {
      this.event = event || undefined;
    });
  }
  closeDetails(): void {
    this.eventDataService.setSelectedEvent(null);
  }
  goToDetails() {
  this.navCtrl.navigateForward(['/event-checkoutme']);
}

}
