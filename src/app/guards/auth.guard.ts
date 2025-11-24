import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Renovar la sesión cada vez que se accede a una ruta protegida
      this.authService.renewSession();
      return true;
    } else {
      this.router.navigate(['/inicial']);
      return false;
    }
  }
}