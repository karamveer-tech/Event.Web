import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
   selector: 'app-event-create-modal',
  standalone: true, // ✅ Using standalone
  templateUrl: './event-create-modal.component.html',
  styleUrls: ['./event-create-modal.component.scss'],
  imports: [FormsModule] // ✅ Import FormsModule directly here
})
export class EventCreateModalComponent {
  event = {
    title: '',
    description: '',
    location: '',
    start: '',
    end: '',
    status: 'Scheduled'
  };

  constructor(public activeModal: NgbActiveModal) {}

  onSubmit() {
    if (this.event.title && this.event.start && this.event.end) {
      this.activeModal.close(this.event);
    }
  }
}
