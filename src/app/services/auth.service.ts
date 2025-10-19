import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.checkAuth();
  }

  private checkAuth() {
    const usuario = this.getUsuarioActual();
    this.isAuthenticated.next(!!usuario);
  }

  // Verificar si el email ya existe
  async verificarEmailExistente(email: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('usuarios')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error verificando email:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    }
  }

  // Registrar nuevo usuario
  async registrarUsuario(usuario: any): Promise<{exito: boolean, mensaje: string}> {
    try {
      console.log('Intentando registrar usuario:', usuario);

      // Verificar si el email ya existe
      const emailExiste = await this.verificarEmailExistente(usuario.email);
      
      if (emailExiste) {
        return {
          exito: false,
          mensaje: 'El email ya está registrado'
        };
      }

      // Insertar nuevo usuario
      const { data, error } = await this.supabaseService.getClient()
        .from('usuarios')
        .insert([{
          nombre_usuario: usuario.nombreUsuario,
          nombre: usuario.nombre,
          email: usuario.email,
          contrasena: usuario.contrasena
        }])
        .select()
        .single();

      if (error) {
        console.error('Error en registro:', error);
        return {
          exito: false,
          mensaje: 'Error al registrar usuario: ' + error.message
        };
      }

      console.log('Usuario registrado exitosamente:', data);
      return {
        exito: true,
        mensaje: 'Usuario registrado exitosamente'
      };

    } catch (error) {
      console.error('Error inesperado registrando usuario:', error);
      return {
        exito: false,
        mensaje: 'Error inesperado al registrar usuario'
      };
    }
  }

  // Iniciar sesión
  async login(email: string, contrasena: string): Promise<{exito: boolean, mensaje: string}> {
    try {
      console.log('Intentando login con:', { email, contrasena });

      // Buscar usuario por email y contraseña
      const { data: usuario, error } = await this.supabaseService.getClient()
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('contrasena', contrasena)
        .single();

      if (error) {
        console.error('Error en login:', error);
        if (error.code === 'PGRST116') {
          return {
            exito: false,
            mensaje: 'Email o contraseña incorrectos'
          };
        }
        return {
          exito: false,
          mensaje: 'Error al iniciar sesión: ' + error.message
        };
      }

      if (usuario) {
        console.log('Login exitoso, usuario:', usuario);
        localStorage.setItem('usuario_actual', JSON.stringify(usuario));
        this.isAuthenticated.next(true);
        return {
          exito: true,
          mensaje: 'Login exitoso'
        };
      }

      return {
        exito: false,
        mensaje: 'Email o contraseña incorrectos'
      };

    } catch (error) {
      console.error('Error inesperado en login:', error);
      return {
        exito: false,
        mensaje: 'Error inesperado al iniciar sesión'
      };
    }
  }

  // Cerrar sesión
  async logout(): Promise<boolean> {
    try {
      localStorage.removeItem('usuario_actual');
      this.isAuthenticated.next(false);
      await this.router.navigate(['/inicial']);
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  }

  // Obtener usuario actual
  getUsuarioActual(): any {
    const usuario = localStorage.getItem('usuario_actual');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Verificar autenticación
  isLoggedIn(): boolean {
    return !!this.getUsuarioActual();
  }

  getAuthState() {
    return this.isAuthenticated.asObservable();
  }
}