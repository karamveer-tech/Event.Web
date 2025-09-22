import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
   standalone: true,           // mark as standalone
  imports: [QRCodeComponent],
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent  implements OnInit {
 qrData = 'https://example.com';               // fallback data
  qrCodeDownloadLink: SafeUrl | null = null;    // filled by (qrCodeURL) event


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // read query params and set qrData
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.qrData = params['data'];
      } else if (params['bookingId']) {
        // example: create a ticket URL from bookingId
        this.qrData = `https://your-site.example/ticket?bookingId=${params['bookingId']}`;
      }
    });
  }
   onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

}
