import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private readonly USER_KEY = 'usuario_actual';
  private readonly SESSION_KEY = 'sesion_activa';

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private emailService: EmailService
  ) {
    this.checkAuth();
  }

  private checkAuth() {
    const usuario = this.getUsuarioActual();
    const sesionActiva = this.isSessionActive();
    
    if (usuario && sesionActiva) {
      console.log('Sesión persistente encontrada, usuario autenticado:', usuario.email);
      this.isAuthenticated.next(true);
    } else {
      console.log('No hay sesión activa, limpiando datos...');
      this.cleanupSession();
      this.isAuthenticated.next(false);
    }
  }

  private isSessionActive(): boolean {
    const sesionActiva = localStorage.getItem(this.SESSION_KEY);
    return sesionActiva === 'true';
  }

  private setSessionActive(active: boolean): void {
    localStorage.setItem(this.SESSION_KEY, active.toString());
  }

  private cleanupSession(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.SESSION_KEY);
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

      // ENVIAR EMAIL DE BIENVENIDA - No esperamos a que termine para no bloquear al usuario
      this.enviarEmailBienvenida(usuario.email, usuario.nombre);

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

  // Método para enviar email de bienvenida (no bloqueante)
  private async enviarEmailBienvenida(email: string, nombre: string): Promise<void> {
    try {
      console.log('Enviando email de bienvenida a:', email);
      
      const resultado = await this.emailService.sendWelcomeEmail(email, nombre);
      
      if (resultado.success) {
        console.log('Email de bienvenida enviado exitosamente');
      } else {
        console.warn('No se pudo enviar el email de bienvenida:', resultado.message);
      }
    } catch (error) {
      console.error('Error en el proceso de envío de email:', error);
      // No lanzamos error para no afectar el flujo de registro
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
        
        // Guardar usuario y activar sesión persistente
        localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
        this.setSessionActive(true);
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
      this.cleanupSession();
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
    const usuario = localStorage.getItem(this.USER_KEY);
    return usuario ? JSON.parse(usuario) : null;
  }

  // Verificar autenticación
  isLoggedIn(): boolean {
    return !!this.getUsuarioActual() && this.isSessionActive();
  }

  getAuthState() {
    return this.isAuthenticated.asObservable();
  }

  // Método para renovar sesión (útil si quieres expiración)
  renewSession(): void {
    this.setSessionActive(true);
  }
}