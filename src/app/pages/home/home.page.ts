import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // ✅ Import IonicModule

@Component({
  standalone: true, // ✅ Make it standalone
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule], // ✅ Import IonicModule here
})
export class HomePage {}