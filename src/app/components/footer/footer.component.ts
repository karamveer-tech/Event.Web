import { Component, OnInit, Renderer2 } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
   standalone: true, // ✅ this is crucial
  imports: [CommonModule, IonicModule,
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {
currentYear: number = new Date().getFullYear();
  constructor(private renderer: Renderer2) { }

  ngOnInit() {}
  ngAfterViewInit() {
  
}
}