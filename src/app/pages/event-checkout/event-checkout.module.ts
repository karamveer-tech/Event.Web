import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { EventCheckoutComponent } from './event-checkout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EventCheckoutComponent 
  ],
  providers: [CurrencyPipe],
})
export class EventCheckoutModule {}