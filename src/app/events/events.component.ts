import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { EventModel, EventService } from '../event-create-modal/event.service';
import { Router } from '@angular/router';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { UserEventDetailsComponent } from '../pages/user-event-details/user-event-details.component';
  

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule,UserEventDetailsComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  loading = false;
  events?: EventModel[] = [];
  isViewDetails : boolean = false;

  constructor(private eventService: EventService,public eventDataService: EventService, private renderer: Renderer2, private router: Router) {
    this.loadEvents();
  }

  ngOnInit() {
    console.log(this.isViewDetails);
    //this.loadEvents();
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
    debugger
  
    // this.router.navigate(['/event-details', eventId]);
    this.loading = true;
    this.eventService.getEventById(eventId).subscribe(
      (data: EventModel) => {
        // Send data via service
        this.eventService.setSelectedEvent(data);
        this.isViewDetails = true;
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching event:', err);
        this.loading = false;
      }
    );
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
