import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { EventModel, EventService } from '../event-create-modal/event.service';
import { Router, NavigationEnd } from '@angular/router';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { UserEventDetailsComponent } from '../pages/user-event-details/user-event-details.component';
  

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule,UserEventDetailsComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnDestroy {
  loading = false;
  events?: EventModel[] = [];

  private routerSubscription: any;
  constructor(private eventService: EventService, public eventDataService: EventService, private navCtrl: NavController, private router: Router) {
    this.loadEvents();
    this.eventService.setSelectedEvent(null); // Clear selected event on load
    // Listen for navigation to /event and reset selectedEvent
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.startsWith('/event')) {
        this.eventService.setSelectedEvent(null);
        this.loadEvents();
      }
    });
  }
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

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
  getEventDetails(eventId :number): void{
    
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
    // this.router.navigate(['/event-details', eventId]);
    // this.loading = true;
    // this.eventService.getEventById(eventId).subscribe(
    //   (data: EventModel) => {
    //     // Send data via service
    //     this.eventService.setSelectedEvent(data);
    //     this.navCtrl.navigateForward(['/user-event-details']);
    //     this.loading = false;
    //   },
    //   (err) => {
    //     console.error('Error fetching event:', err);
    //     this.loading = false;
    //   }
    // );
  }
  // loadStyle(href: string) {
  //   const link = this.renderer.createElement('link');
  //   link.rel = 'stylesheet';
  //   link.href = href;
  //   this.renderer.appendChild(document.head, link);
  // }

  // loadScript(src: string) {
  //   const script = this.renderer.createElement('script');
  //   script.type = 'text/javascript';
  //   script.src = src;
  //   script.defer = true;
  //   this.renderer.appendChild(document.body, script);
  // }
}
