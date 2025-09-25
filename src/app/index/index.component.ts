import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { EventModel, EventService } from '../event-create-modal/event.service';
import { EventsComponent } from '../events/events.component';
import { UsersService } from '../pages/users.service';

@Component({
  selector: 'app-index',

  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule, EventsComponent],

  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  loading = false;
  events: EventModel[] = [];
  apiVersion: string = ''; // Default version

  constructor(private eventService: EventService, private navCtrl: NavController,private userDataService: UsersService) { }

  ngOnInit() {
    
     this.userDataService.getApiVersion().subscribe({
      next: (res) => {
        
        this.apiVersion = res;
      },
      error: (err) => {
        console.error('Failed to load api version', err);
      }
    });
    this.loadEvents();
  }


  ngAfterViewInit() {
    
  }

  // loadStyle(href: string) {
  //   const link = this.renderer.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = href;
  //   link.crossOrigin = 'anonymous'; // Optional for CDNs
  //   link.referrerPolicy = 'no-referrer'; // Optional
  //   this.renderer.appendChild(document.head, link);
  // }

  // loadScript(src: string) {
  //   const script = this.renderer.createElement('script');
  //   script.type = 'text/javascript';
  //   script.src = src;
  //   script.defer = true;
  //   this.renderer.appendChild(document.body, script);
  // }
  loadEvents(): void {
    
    this.loading = true;
    this.eventService.getUserEvents().subscribe({
      next: (data: EventModel[]) => {
        
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }
  goToDetails(eventId :number):void {
     this.loading = true;
    this.eventService.getEventById(eventId).subscribe(
      (data: EventModel) => {
        // Send data via service
        this.eventService.setSelectedEvent(data);
        // Navigate to user-event-details/:id
      this.navCtrl.navigateForward(['/user-event-details', eventId]);
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching event:', err);
        this.loading = false;
      }
    );
    // this.navCtrl.navigateForward(['/user-event-details']);
  }
}
