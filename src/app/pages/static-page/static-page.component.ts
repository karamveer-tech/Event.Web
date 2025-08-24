import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from 'src/app/pipes/safe-url.pipe';

@Component({
  standalone: true,
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    SafeUrlPipe
  ]
})
export class StaticPageComponent {
  public pageUrl: string = '';
  public eventId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      const file = data['htmlFile'] || 'default';
      this.pageUrl = `assets/${file}.html`;
    });

    // Get route param :id
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
    });
  }
}
