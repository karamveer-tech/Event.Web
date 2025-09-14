import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { EventModel, EventService } from '../event-create-modal/event.service';
import { EventsComponent } from '../events/events.component';

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

  constructor(private eventService: EventService, private navCtrl: NavController) { }

  ngOnInit() {
    this.loadEvents();
  }


  ngAfterViewInit() {
    // External CDN Styles
    // [
    //   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    //   'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    //   'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
    //   'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
    //   'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css',
    // ].forEach(href => this.loadStyle(href));

    // // Local Styles
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

    // // Local Scripts
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
    //   'assets/js/countdown.min.js',
    //   'assets/js/odometer.min.js',
    //   'assets/js/viewport.jquery.js',
    //   'assets/js/nice-select.js',
    //   'assets/js/main.js',
    //   'assets/js/config.js', 
    //   'assets/js/index.js', 
    // ].forEach(src => this.loadScript(src));
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
    debugger
    this.loading = true;
    this.eventService.getUserEvents().subscribe({
      next: (data: EventModel[]) => {
        debugger
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }
  goToDetails() {
        this.navCtrl.navigateForward(['/user-event-details']);
  }
}
