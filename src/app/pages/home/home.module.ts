// src/app/pages/home/home.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { IonicModule }   from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage }      from './home.page';
import { DashboardPage } from './home.dashboard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HomePage,        // ← import standalone
    DashboardPage    // ← import standalone
  ],
  // ▶️ remove `declarations` entirely!
})
export class HomePageModule {}
