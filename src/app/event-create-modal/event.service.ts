import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CONFIG } from '../confiq/confiq';

export interface PaidTicket {
    name: string;
    seats: number | null;
    price: number | null;
}

export interface EventModel {
    id: number;
    title: string;
    description?: string;
    location?: string;
    address?: string;
    start_datetime: string;
    end_datetime: string;
    banner_path: string;
    ticketType: 'Free' | 'Paid';
    freeSeats?: number | null;
    paidTickets?: PaidTicket[];
    banner?: File | null;
    images?: File | null;
    status: 'Draft' | 'Published';
    // csvFile?: File | null;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
     private selectedEventSubject = new BehaviorSubject<EventModel | null>(null);
     selectedEvent$: Observable<EventModel | null> = this.selectedEventSubject.asObservable();
    constructor(private http: HttpClient) { }

    createEvent(event: EventModel): Observable<any> {
        const formData = new FormData();
        formData.append('title', event.title || '');
        formData.append('description', event.description || '');
        formData.append('location', event.location || '');
        formData.append('start_datetime', new Date(event.start_datetime).toISOString());
        formData.append('end_datetime', new Date(event.end_datetime).toISOString());
        formData.append('ticketType', event.ticketType || '');
        formData.append('status', event.status || '');

        if (event.ticketType === 'Free') {
            formData.append('freeSeats', (event.freeSeats ?? 0).toString());
        } else if (event.ticketType === 'Paid') {
            formData.append('paidTicketsJson', JSON.stringify(event.paidTickets || []));
        }

         if (event.banner instanceof File) {
    formData.append("banner", event.banner, event.banner.name);
  }
        // if (event.csvFile) formData.append('csvFile', event.csvFile, event.csvFile.name);

        return this.http.post(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.CREATE_EVENT}`, formData);
    }

    editEvent(event: EventModel): Observable<any> {
        const formData = new FormData();
        formData.append('id', event.id?.toString() || ''); // ensure ID is included
        formData.append('title', event.title || '');
        formData.append('description', event.description || '');
        formData.append('location', event.location || '');
        formData.append('start_datetime', new Date(event.start_datetime).toISOString());
        formData.append('end_datetime', new Date(event.end_datetime).toISOString());
        formData.append('ticketType', event.ticketType || '');
        formData.append('status', event.status || '');

        if (event.ticketType === 'Free') {
            formData.append('freeSeats', (event.freeSeats ?? 0).toString());
        } else if (event.ticketType === 'Paid') {
            formData.append('paidTicketsJson', JSON.stringify(event.paidTickets || []));
        }

        // Only append if user uploaded new files
        if (event.banner instanceof File) {
            formData.append('banner', event.banner, event.banner.name);
        }
debugger
        return this.http.post(
            `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.UPDATE_EVENT}`,
            formData
        );
    }
    getEvents(): Observable<EventModel[]> {
        return this.http.get<EventModel[]>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_EVENTS}`);
    }
     getUserEvents(): Observable<EventModel[]> {
        return this.http.get<EventModel[]>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_USER_EVENTS}`);
    }
    getEventById(eventId: number): Observable<EventModel> {
        return this.http.get<EventModel>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GET_EVENT_BY_ID}/${eventId}`);
    }
    deleteEvent(eventId: number): Observable<EventModel> {
        return this.http.delete<EventModel>(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.DELETE_EVENT}/${eventId}`);
    }
    setSelectedEvent(event: EventModel | null) {
    this.selectedEventSubject.next(event);
  }
}
