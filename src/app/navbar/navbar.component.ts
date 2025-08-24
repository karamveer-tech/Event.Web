import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
   menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  constructor(private renderer: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Load CSS
    [
      'assets/css/bootstrap.min.css',
      'assets/css/fontawesome.min.css',
      'assets/css/animate.css',
      'assets/css/magnific-popup.css',
      'assets/css/odometer.css',
      'assets/css/owl.carousel.min.css',
      'assets/css/owl.theme.default.min.css',
      'assets/css/nice-select.css',
      'assets/css/jquery.animatedheadline.css',
      'assets/css/style.css'
    ].forEach(href => this.loadStyle(href));

    // Load JS
    [
      'assets/js/jquery-3.6.0.min.js',
      'assets/js/modernizr-3.6.0.min.js',
      'assets/js/plugins.js',
      'assets/js/bootstrap.bundle.min.js',
      'assets/js/heandline.js',
      'assets/js/isotope.pkgd.min.js',
      'assets/js/magnific-popup.min.js',
      'assets/js/owl.carousel.min.js',
      'assets/js/wow.min.js',
      'assets/js/countdown.min.js',
      'assets/js/odometer.min.js',
      'assets/js/viewport.jquery.js',
      'assets/js/nice-select.js',
      'assets/js/main.js',
      'assets/js/config.js',
      'assets/js/event.js',
      'assets/js/footer.js'
    ].forEach(src => this.loadScript(src));
  }

  loadStyle(href: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }

  loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.defer = true;
    this.renderer.appendChild(document.body, script);
  }
}
