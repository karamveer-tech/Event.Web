import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EventModel, EventService } from '../event-create-modal/event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  // sponsors = [
  //   { img: 'assets/img/sponsor/01.svg' },
  //   { img: 'assets/img/sponsor/02.svg' },
  //   { img: 'assets/img/sponsor/03.svg' },
  //   { img: 'assets/img/sponsor/04.svg' },
  //   { img: 'assets/img/sponsor/05.svg' },
  // ];

  // Countdown bindings
  // days: string = '00';
  // hours: string = '00';
  // minutes: string = '00';
  // seconds: string = '00';
  //private countdownInterval: any;
  event!: EventModel;
  

  data:any;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit() {
    
     const eventId = Number(this.route.snapshot.paramMap.get('id'));
      this.eventService.getEventById(eventId).subscribe((data: EventModel) => {
        
        this.data = data;
      });

    // const eventId = localStorage.getItem('event_Id');
    // if (!eventId) {
    //   return;
    // }

    // const apiUrl = `http://148.113.192.114:5000/api/Event/get-event-by-id/${eventId}`; // Replace with real base URL

    // this.http.get<any>(apiUrl).subscribe(
    //   (event) => {
    //     const endDate = new Date(event.end_datetime);
    //     if (isNaN(endDate.getTime())) {
    //       console.error('Invalid end date from API:', event.end_datetime);
    //       return;
    //     }

    //     this.startCountdown(endDate);
    //   },
    //   (error) => {
    //     console.error('Error fetching event details:', error);
    //     alert("Failed to load event details.");
    //   }
    // );
  }

  
  closeDetails(): void {
    this.eventService.setSelectedEvent(null);
  }
  loadStyle(href: string) {
    // const link = this.renderer.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = href;
    // this.renderer.appendChild(document.head, link);
  }

  loadScript(src: string) {
    // const script = this.renderer.createElement('script');
    // script.type = 'text/javascript';
    // script.src = src;
    // script.defer = true;
    // this.renderer.appendChild(document.body, script);
  }

  //ngOnDestroy() {
    // if (this.countdownInterval) {
    //   clearInterval(this.countdownInterval);
    // }
  //}

  getSlidesPerView(): number {
    const width = window.innerWidth;
    if (width < 576) return 2;
    if (width < 768) return 3;
    if (width < 992) return 4;
    return 5;
  }
}
