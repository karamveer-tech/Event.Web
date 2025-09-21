import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit,
  AfterViewInit
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


export class EventCreateModalComponent implements OnInit, AfterViewInit {
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
    images: [],
    status: 'Draft',
    lat: 0,
    lng: 0
  };

  csvPreview: any = null;
  bannerPreview: string | ArrayBuffer | null = null;
  imagesPreview: string[] = [];
  message: string = '';
  isUpdate:boolean=false;
  // @ViewChild('addressInput') addressInput!: ElementRef;
  zoom = 6;

  isSubmitting = false;
  selectedFiles: File[] = [];      // newly selected files
  previewUrls: string[] = [];   

  autocomplete!: google.maps.places.Autocomplete;
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
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
  
   this.loadGoogleMaps().then(() => {
    // Wait until google.maps.places is ready
    const checkInterval = setInterval(() => {
      if ((window as any).google?.maps?.places) {
        this.initAutocomplete();
        clearInterval(checkInterval);
      }
    }, 100);
  });
  }
  private loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      
      // Already loaded?
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyDcFSb86CXbGl1Lftb5zdqOJEA1OFhfcVg&libraries=places';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }
 private initAutocomplete(): void {
  
    const input = this.addressInput ? this.addressInput.nativeElement : document.getElementById('autocomplete') as HTMLInputElement;
   if (!this.addressInput) {
      console.error('Address input not found');
      return;
    }
if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) {
    console.error('Google Maps Places library not loaded yet');
    return;
  }
    this.autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['geocode'],
    });

    this.autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = this.autocomplete.getPlace();

        if (place.formatted_address) {
          this.event.location = place.formatted_address;
        }

        if (place.geometry && place.geometry.location) {
          this.event.lat = place.geometry.location.lat();
          this.event.lng = place.geometry.location.lng();
        }

      });
    });
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
      reader.onload = (e: any) => {
      this.bannerPreview = e.target.result; // Replace old preview with new
    };
    reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file');
    }
  }
  // onImageUpload(event: any) {
  //   
  //   const file = event.target.files[0];
  //   if (file && file.type.startsWith('image/')) {
  //     this.event.images = file;
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => this.imagesPreview = e.target.result;
  //     reader.readAsDataURL(file);
  //   } else {
  //     alert('Please upload a valid image file');
  //   }
  // }

//   onImageUpload(event: any) {
//   const files: FileList = event.target.files;
//   if (files && files.length > 0) {
//     this.event.images = []; // Reset the array
//     this.imagesPreview = []; // Reset previews

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       if (file.type.startsWith('image/')) {
//         this.event.images.push(file); // Store the file

//         const reader = new FileReader();
//         reader.onload = (e: any) => {
//           this.imagesPreview.push(e.target.result); // Store preview
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert(`File ${file.name} is not a valid image.`);
//       }
//     }
//   }
// }
onImageUpload(event: any) {
  
  const files: FileList = event.target.files;
  if (files && files.length > 0) {
    // Ensure images array is initialized
    if (!this.event.images) {
      this.event.images = [];
    } else {
      this.event.images.length = 0; // Clear existing images
    }

    // Ensure imagesPreview array is initialized
    if (!this.imagesPreview) {
      this.imagesPreview = [];
    } else {
      this.imagesPreview.length = 0; // Clear existing previews
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.event.images.push(file); // Store the file

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagesPreview.push(e.target.result); // Store preview
        };
        reader.readAsDataURL(file);
      } else {
        alert(`File ${file.name} is not a valid image.`);
      }
    }
  }
}
removeExistingImage(index: number) {
  this.event.images?.splice(index, 1);
}

// Remove new (just selected) image
removeNewImage(index: number) {
  this.selectedFiles.splice(index, 1);
  this.previewUrls.splice(index, 1);
}

  // Submit event using service
  submitEvent() {
    
    if (this.event.id == 0 || this.event.id == null || this.event.id == undefined) {
      this.isSubmitting = true;
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
          this.isSubmitting = false;
        }
      });
    }
    else {
      this.isSubmitting = true;
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
          this.isSubmitting = false;
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
