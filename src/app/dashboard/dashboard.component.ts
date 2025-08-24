import {
  Component,
  OnInit,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('createEventModal') createEventModalRef!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
      'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
      'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css',
    ].forEach((href) => this.loadStyle(href));

    [
      'https://code.jquery.com/jquery-3.6.0.min.js',
      'https://cdn.tailwindcss.com',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/flatpickr',
      'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js',
      'assets/js/config.js',
      'assets/js/event.js',
      'assets/js/dashboard.js',
      'assets/js/eventDetails.js',
    ].forEach((src) => this.loadScript(src));
  }

  openCreateEventModal(): void {
    this.createEventModalRef.nativeElement.classList.remove('hidden');
  }

  closeCreateEventModal(): void {
    this.createEventModalRef.nativeElement.classList.add('hidden');
  }

  private loadStyle(href: string) {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    this.renderer.appendChild(document.head, link);
  }

  private loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.defer = true;
    this.renderer.appendChild(document.body, script);
  }
}
