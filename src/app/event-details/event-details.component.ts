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
  events!: EventModel;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit() {
    debugger
     const eventId = Number(this.route.snapshot.paramMap.get('id'));
      this.eventService.getEventById(eventId).subscribe((data: EventModel) => {
        this.events = data;
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

  // startCountdown(targetDate: Date) {
  //   const update = () => {
  //     const now = new Date().getTime();
  //     const target = targetDate.getTime();
  //     const distance = target - now;

  //     if (distance <= 0) {
  //       this.days = this.hours = this.minutes = this.seconds = '00';
  //       clearInterval(this.countdownInterval);
  //       return;
  //     }

  //     const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  //     const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //     const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     const s = Math.floor((distance % (1000 * 60)) / 1000);

  //     this.days = d.toString().padStart(2, '0');
  //     this.hours = h.toString().padStart(2, '0');
  //     this.minutes = m.toString().padStart(2, '0');
  //     this.seconds = s.toString().padStart(2, '0');
  //   };

  //   update(); // immediate run
  //   this.countdownInterval = setInterval(update, 1000);
  // }

 // ngAfterViewInit() {
    // Load required styles
    // [
    //   'assets/css/bootstrap.min.css',
    //   'assets/css/fontawesome.min.css',
    //   'assets/css/animate.css',
    //   'assets/css/magnific-popup.css',
    //   'assets/css/odometer.css',
    //   'assets/css/owl.carousel.min.css',
    //   'assets/css/owl.theme.default.min.css',
    //   'assets/css/nice-select.css',
    //   'assets/css/jquery.animatedheadline.css',
    //   'assets/css/style.css'
    // ].forEach(href => this.loadStyle(href));

    // Load JS except eventDetails.js (now handled in Angular)
    // [
    //   'assets/js/jquery-3.6.0.min.js',
    //   'assets/js/modernizr-3.6.0.min.js',
    //   'assets/js/plugins.js',
    //   'assets/js/bootstrap.bundle.min.js',
    //   'assets/js/heandline.js',
    //   'assets/js/isotope.pkgd.min.js',
    //   'assets/js/magnific-popup.min.js',
    //   'assets/js/owl.carousel.min.js',
    //   'assets/js/wow.min.js',
    //   'assets/js/odometer.min.js',
    //   'assets/js/viewport.jquery.js',
    //   'assets/js/nice-select.js',
    //   'assets/js/main.js',
    //   'assets/js/footer.js',
    //   'assets/js/config.js',
    //   'assets/js/eventDetails.js',
    //  ].forEach(src => this.loadScript(src));
  //}

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
