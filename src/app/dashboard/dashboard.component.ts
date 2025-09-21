import {
  Component,
  OnInit,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService, EventModel } from '../event-create-modal/event.service';
import * as eventCreateModalComponent from '../event-create-modal/event-create-modal.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, DatePipe],
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('createEventModal') createEventModalRef!: ElementRef;
  loading = false;
  events: EventModel[] = [];
  selectedEvent: EventModel | null = null; // event to edit
  enableEdit = true;

  constructor(private renderer: Renderer2, private modalService: NgbModal, private eventService: EventService, private router: Router) { }

  ngOnInit(): void {

    this.loadEvents();
  }

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

  loadEvents(): void {
    
    this.loading = true;
    this.eventService.getEvents().subscribe({
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


deleteEvent(eventId: number) {
  if (confirm("Are you sure you want to delete this event?")) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: (res) => {
        alert("✅ Event deleted successfully!");
        window.location.reload();

      },
      error: (err) => {
        alert("❌ Failed to delete event. Please try again.");
        this.loading = false;
      }
    });
  }
}

logout():void{
  if (localStorage.getItem('auth_token')) {
      localStorage.removeItem('auth_token');
    }

    if (localStorage.getItem('role')) {
      localStorage.removeItem('role');
    }

    if (localStorage.getItem('email')) {
      localStorage.removeItem('email');
    }
  window.location.href = '/login';
}

  saveEvent(event: any) {
    console.log('Save');
  }





  openEditEventModal(eventData: any): void {
    this.eventService.getEventById(eventData.id).subscribe({
      next: (res: any) => {
        // Normalize ticketType
        const normalizedTicketType =
          res.ticketType?.toLowerCase() === 'paid' ? 'Paid' : 'Free';

        const normalizedStatus =
          res.status?.toLowerCase() === 'draft' ? 'draft' : 'published';
        // Prepare event data for modal
        const eventForModal = {
          ...res,
          ticketType: normalizedTicketType,
          status: normalizedStatus,
          freeSeats: res.freeSeats || 0,
          paidTickets: Array.isArray(res.paidTickets) && res.paidTickets.length
            ? res.paidTickets.map((t: any) => ({
              name: t.name || '',
              seats: t.seats || '',
              price: t.price || ''
            }))
            : [{ name: '', seats: '', price: '' }],
          banner: res.banner_path
            ? { url: res.banner_path, name: this.extractFileName(res.banner_path) }
            : null
          // csvFile: res.csvFile_path
          //   ? { url: res.csvFile_path, name: this.extractFileName(res.csvFile_path) }
          //   : null,
          // images: Array.isArray(res.images)
          //   ? res.images.map((img: any) => ({
          //     url: img.url || img,
          //     name: this.extractFileName(img.url || img)
          //   }))
          //   : []
        };

        // Open modal
        const modalRef = this.modalService.open(
          eventCreateModalComponent.EventCreateModalComponent,
          {
            size: 'lg',
            backdrop: 'static',
            keyboard: false
          }
        );

        modalRef.componentInstance.event = eventForModal;
        modalRef.componentInstance.bannerPreview = eventForModal.banner?.url || null;
        // modalRef.componentInstance.imagesPreview =
        //   eventForModal.images?.map((img: any) => img.url) || [];

        modalRef.componentInstance.currentTab = 1;

        modalRef.result
          .then((result) => {
            if (result) {
              console.log('Event updated:', result);
            }
          })
          .catch(() => {
            console.log('Modal dismissed');
          });
      },
      error: (err: any) => {
        console.error('Failed to fetch event:', err);
      }
    });
  }


  private extractFileName(path: string): string {
    return path?.split('/').pop() || '';
  }


  openCreateEventModal(): void {

    // this.createEventModalRef.nativeElement.classList.remove('hidden');
    const modalRef = this.modalService.open(eventCreateModalComponent.EventCreateModalComponent, {
      size: 'lg',   // large modal
      backdrop: 'static',  // disable closing when clicking outside
      keyboard: false      // disable ESC close
    });

    // get data when modal closes
    modalRef.result.then((result) => {
      if (result) {
       this.loadEvents();
      }
    }).catch(() => {
      console.log('Modal dismissed');
    });
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
