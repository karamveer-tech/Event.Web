import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  isLoggedIn: boolean = false;
  userEmail: string = '';
  userRole: string = '';
  dropdownOpen: boolean = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  constructor(private renderer: Renderer2,public router:Router,private navCtrl: NavController) {}

  ngOnInit() {
    
    const token = localStorage.getItem('auth_token');
    this.userRole = localStorage.getItem('role') || '';
    this.userEmail = localStorage.getItem('username') || '';

    this.isLoggedIn = !!token && (this.userRole === 'enduser'|| this.userRole === 'admin');
  }
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
   if (localStorage.getItem('auth_token')) {
      localStorage.removeItem('auth_token');
    }

    if (localStorage.getItem('role')) {
      localStorage.removeItem('role');
    }

    if (localStorage.getItem('email')) {
      localStorage.removeItem('email');
    }

    this.dropdownOpen = false;
    // this.router.navigate(['/login']);
    window.location.href = '/login';
  // this.navCtrl.navigateForward(['/login']);
  }
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
  RouteME () {
    this.router.navigate(['/event']);
  }
}
