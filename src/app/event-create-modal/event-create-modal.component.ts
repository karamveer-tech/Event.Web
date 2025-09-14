import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { EventService, EventModel, PaidTicket } from '../event-create-modal/event.service';
// import { GoogleMapsModule } from '@angular/google-maps';
import { Router, RouterModule } from '@angular/router';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
@Component({
  selector: 'app-event-create-modal',
  standalone: true,
  templateUrl: './event-create-modal.component.html',
  styleUrls: ['./event-create-modal.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule]
})


export class EventCreateModalComponent implements AfterViewInit {
  static EventCreateModalComponent(EventCreateModalComponent: any, arg1: { size: string; backdrop: "static"; keyboard: false; }) {
    throw new Error('Method not implemented.');
  }
  // export class  implements AfterViewInit {
  // static EventCreateModalComponent(EventCreateModalComponent: any, arg1: { size: string; backdrop: "static"; keyboard: false; }) {
  //   throw new Error('Method not implemented.');
  // }
  currentTab: number = 1;

  event: EventModel = {
    id: 0,
    title: '',
    description: '',
    location: '',
    address: '',
    start_datetime: '',
    end_datetime: '',
    banner_path: '',
    ticketType: 'Free',
    freeSeats: null,
    paidTickets: [],
    banner: null,
    images: null,
    status: 'Draft'
  };

  csvPreview: any = null;
  bannerPreview: string | ArrayBuffer | null = null;
  imagesPreview: string | ArrayBuffer | null = null;
  message: string = '';
  isUpdate:boolean=false;
  @ViewChild('addressInput') addressInput!: ElementRef;
  zoom = 6;
  // center: google.maps.LatLngLiteral = { lat: 20.5937, lng: 78.9629 }; // default center (India)
  // markerPosition: google.maps.LatLngLiteral | null = null;
  constructor(public activeModal: NgbActiveModal, private eventService: EventService, private ngZone: NgZone, private router: Router) { }


  ngOnInit() {
      this.isUpdate=!!this.event.id;
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state?.['event']) {
      this.event = nav.extras.state['event'];
    }
  }

  ngAfterViewInit(): void {
    // initialize autocomplete
    // const autocomplete = new google.maps.places.Autocomplete(
    //   this.addressInput.nativeElement,
    //   {
    //     types: ['geocode'] // or 'address'
    //   }
    // );
    // autocomplete.addListener('place_changed', () => {
    //   this.ngZone.run(() => {
    //     const place = autocomplete.getPlace();

    //     if (!place.geometry || !place.geometry.location) {
    //       return;
    //     }

    //     // set map center and marker
    //     const lat = p  lace.geometry.location.lat();
    //     const lng = place.geometry.location.lng();

    //     this.center = { lat, lng };
    //     this.markerPosition = { lat, lng };

    //     // save address & coords
    //     this.event.address = place.formatted_address;
    //     this.event.location = `${lat}, ${lng}`;
    //   });
    // });
  }
  // CSV upload
  // onCSVUpload(event: any) {
  //   const file = event.target.files[0];
  //   if (file && file.type === 'text/csv') {
  //     this.event.csvFile = file;
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => this.csvPreview = e.target.result;
  //     reader.readAsText(file);
  //   } else {
  //     alert('Please upload a valid CSV file');
  //   }
  // }

  // Banner upload
  onBannerUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.event.banner = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.bannerPreview = e.target.result;
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  }
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.event.images = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagesPreview = e.target.result;
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  }
  // Submit event using service
  submitEvent() {
    debugger
    if (this.event.id == 0 || this.event.id == null || this.event.id == undefined) {
      this.eventService.createEvent(this.event).subscribe({
        next: (res: ApiResponse) => {
          if (res.success) {
            this.message = '✅ Event created successfully!';
            this.activeModal.close(res.data);
             alert(this.message);
            window.location.reload();
          } else {
            this.message = '❌ ' + res.message;
          }
        },
        error: (err: { error?: { message?: string }; message: string }) => {
          this.message = '❌ Error creating event: ' + (err?.error?.message || err.message);
        }
      });
    }
    else {
      this.eventService.editEvent(this.event).subscribe({
        next: (res: ApiResponse) => {
          if (res.success) {
            this.message = '✅ Event Updated successfully!';
            this.activeModal.close(res.data);
            alert(this.message);
            window.location.reload();
          } else {
            this.message = '❌ ' + res.message;
          }
        },
        error: (err: { error?: { message?: string }; message: string }) => {
          this.message = '❌ Error creating event: ' + (err?.error?.message || err.message);
        }
      });
    }
  }

  toIso(date: any): string {
    if (!date) return '';
    return new Date(date).toISOString();
  }

  goToTab(tab: number, event?: Event) {
    event?.preventDefault();
    this.currentTab = tab;
  }

  nextTab() { if (this.currentTab < 4) this.currentTab++; }
  prevTab() { if (this.currentTab > 1) this.currentTab--; }
  isNextDisabled(): boolean { return !this.event.title || !this.event.start_datetime || !this.event.end_datetime; }

  addPaidTicket() { this.event.paidTickets?.push({ name: '', seats: null, price: null }); }
  removePaidTicket(index: number) { this.event.paidTickets?.splice(index, 1); }

  onTicketTypeChange(type: 'Free' | 'Paid') {
    this.event.ticketType = type;
    if (!this.event.paidTickets) this.event.paidTickets = [];
    if (type === 'Paid' && this.event.paidTickets.length === 0) {
      this.event.paidTickets.push({ name: '', seats: null, price: null });
    }
  }
  // mapClicked(event: google.maps.MapMouseEvent) {
  //   if (event.latLng != null) {
  //     const lat = event.latLng.lat();
  //     const lng = event.latLng.lng();

  //     // set marker position
  //     this.markerPosition = { lat, lng };

  //     // save to event.location
  //     this.event.location = `${lat}, ${lng}`;
  //   }
  // }

}
