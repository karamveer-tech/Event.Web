import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
  

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, AfterViewInit {
  
  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Load CSS
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

    // // Load JS
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
    //   'assets/js/event.js',
    //   'assets/js/footer.js',
    //   'assets/js/dashboard.js',
    // ].forEach(src => this.loadScript(src));
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
