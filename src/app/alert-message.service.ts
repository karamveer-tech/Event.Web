import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {

  constructor(private snackBar: MatSnackBar) {}
  
showSuccess(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 10000,   // auto close after 3 seconds
    panelClass: ['snackbar-success'],  // optional custom style
    verticalPosition: 'top',           // top or bottom
    horizontalPosition: 'center'       // left, center, right
  });
}

showError(message: string) {
  this.snackBar.open(message, 'OK', {
    duration: 10000,
    panelClass: ['snackbar-error'],
    verticalPosition: 'top',
    horizontalPosition: 'center'
  });
}
 confirm(message: string, action = 'Yes', duration = 5000): Observable<boolean> {
    const snack = this.snackBar.open(message, action, { duration });
    
    return new Observable<boolean>(observer => {
      snack.onAction().subscribe(() => {
        observer.next(true); // User clicked action button
        observer.complete();
      });

      setTimeout(() => {
        observer.next(false); // Timeout or dismissed
        observer.complete();
      }, duration);
    });
  }

}
