import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('token'); // adjust to your login method

    if (!isLoggedIn) {
      this.router.navigate(['/404']); // Redirect to 404 or login
      return false;
    }

    return true;
  }
}
