import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuariosKey = 'ecogarden_usuarios';
  private usuarioActualKey = 'ecogarden_usuario_actual';
  private isAuthenticated = new BehaviorSubject<boolean>(this.checkAuth());

  constructor(private router: Router) {}

  // Registrar nuevo usuario
  registrarUsuario(usuario: any): boolean {
    const usuarios = this.obtenerUsuarios();
    
    // Verificar si el email ya existe
    if (usuarios.find((u: any) => u.email === usuario.email)) {
      return false;
    }

    // Agregar nuevo usuario
    usuarios.push(usuario);
    localStorage.setItem(this.usuariosKey, JSON.stringify(usuarios));
    return true;
  }

  // Iniciar sesión
  login(email: string, contrasena: string): boolean {
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find((u: any) => u.email === email && u.contrasena === contrasena);
    
    if (usuario) {
      localStorage.setItem(this.usuarioActualKey, JSON.stringify(usuario));
      this.isAuthenticated.next(true);
      return true;
    }
    return false;
  }

  // Cerrar sesión - MEJORADO
  logout(): Promise<boolean> {
    return new Promise((resolve) => {
      // Primero limpiar los datos
      localStorage.removeItem(this.usuarioActualKey);
      this.isAuthenticated.next(false);
      
      // Luego navegar
      this.router.navigate(['/inicial']).then(success => {
        resolve(success);
      }).catch(error => {
        console.error('Error durante logout:', error);
        resolve(false);
      });
    });
  }

  // Obtener usuario actual
  getUsuarioActual(): any {
    const usuario = localStorage.getItem(this.usuarioActualKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  // Verificar autenticación
  isLoggedIn(): boolean {
    return this.checkAuth();
  }

  // Observable para estado de autenticación
  getAuthState() {
    return this.isAuthenticated.asObservable();
  }

  private checkAuth(): boolean {
    return !!localStorage.getItem(this.usuarioActualKey);
  }

  private obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem(this.usuariosKey);
    return usuarios ? JSON.parse(usuarios) : [];
  }
}