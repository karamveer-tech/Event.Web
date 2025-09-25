import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModel, EventService } from 'src/app/event-create-modal/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-event-details',
  templateUrl: './user-event-details.component.html',
  styleUrls: ['./user-event-details.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class UserEventDetailsComponent implements OnInit, OnDestroy {
  event?: EventModel;
  leftImages: string[] = [];
  rightImage: string | null = null;
  eventId: number | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private eventDataService: EventService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  // Subscribe to route param and fetch event
  const routeSub = this.route.paramMap
    .pipe(
      switchMap(params => {
        const id = params.get('id');
        this.eventId = id ? +id : null;

        if (!this.eventId) {
          this.navCtrl.navigateRoot(['/event']);
          return of(null);
        }

        // Try to get the event from service first
        return this.eventDataService.selectedEvent$.pipe(
          switchMap(selectedEvent => {
            if (selectedEvent && selectedEvent.id === this.eventId) {
              return of(selectedEvent);
            } else {
              return this.eventDataService.getEventById(this.eventId!);
            }
          })
        );
      })
    )
    .subscribe({
      next: event => {
        if (!event) {
          this.navCtrl.navigateRoot(['/event']);
          return;
        }
        this.event = event;
        this.eventDataService.setSelectedEvent(event);
        localStorage.setItem('selectedEvent', JSON.stringify(event));
        this.prepareImages();
      },
      error: err => {
        console.error('Error fetching event:', err);
        this.navCtrl.navigateRoot(['/event']);
      },
    });

  this.subscriptions.add(routeSub);
}


  // Process images for display
  private prepareImages(): void {
    if (!this.event?.imagesPath) return;

    const baseUrl = 'http://148.113.192.114:5000/';
    // const baseUrl = 'https://localhost:7129/';
    const images = this.event.imagesPath.split(',').map(img => img.trim());
    this.leftImages = images.slice(0, -1).map(img => baseUrl + img);
    this.rightImage = images.length ? baseUrl + images[images.length - 1] : null;
  }

  closeDetails(): void {
    this.eventDataService.setSelectedEvent(null);
  }

  goToCheckout(): void {
   this.navCtrl.navigateForward(['/event-checkoutme']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
