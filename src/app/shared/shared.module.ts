import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
   ],
  imports: [
    CommonModule,
    IonicModule,
    NavbarComponent,
    FooterComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent  // ✅ now you can export it
  ]
})
export class SharedModule {}
