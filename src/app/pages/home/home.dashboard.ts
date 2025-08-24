// src/app/pages/home/home.dashboard.ts
import { Component }        from '@angular/core';
import { IonicModule }      from '@ionic/angular';

@Component({
  standalone: true,
  imports: [IonicModule],   // so you can use <ion-content>, etc.
  selector: 'app-dashboard',
  templateUrl: './home.dashboard.html',
  styleUrls: ['./home.page.scss'],
})
export class DashboardPage {}
