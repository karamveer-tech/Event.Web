import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { EventModel, EventService } from '../event-create-modal/event.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, OnDestroy {
  loading = false;
  events: EventModel[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
     public eventDataService: EventService,
    private navCtrl: NavController,
    private router: Router
  ) 
  {
    localStorage.removeItem("selectedEvent");
  }

  ngOnInit() {
    
    this.loadEvents();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        if (event.urlAfterRedirects.startsWith('/event')) {
          this.eventService.setSelectedEvent(null);
          this.loadEvents();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      },
    });
  }

  getEventDetails(eventId: number): void {
    this.loading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (data: EventModel) => {
        this.eventService.setSelectedEvent(data);
        this.navCtrl.navigateForward(['/user-event-details', eventId]);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
