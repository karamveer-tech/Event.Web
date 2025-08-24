import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { EventCreateModalComponent } from './event-create-modal/event-create-modal.component';
import { HttpClientModule } from '@angular/common/http';


 
@NgModule({
  declarations: [AppComponent],
  imports: [FormsModule,EventCreateModalComponent, BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    NavbarComponent, FooterComponent, NgbModule, HttpClientModule  
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
