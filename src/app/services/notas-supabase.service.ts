import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotasSupabaseService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  // Obtener todas las notas del usuario
  async getNotas() {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) return [];

    const { data, error } = await this.supabaseService.getClient()
      .from('notas')
      .select('*')
      .eq('usuario_id', usuario.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo notas:', error);
      return [];
    }

    return data || [];
  }

  // Crear nueva nota
  async crearNota(nota: any) {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) return null;

    const notaData = {
      titulo: nota.title,
      contenido: nota.content,
      usuario_id: usuario.id
    };

    const { data, error } = await this.supabaseService.getClient()
      .from('notas')
      .insert([notaData])
      .select();

    if (error) {
      console.error('Error creando nota:', error);
      return null;
    }

    return data ? data[0] : null;
  }

  // Actualizar nota
  async actualizarNota(id: string, nota: any) {
    const notaData = {
      titulo: nota.title,
      contenido: nota.content,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabaseService.getClient()
      .from('notas')
      .update(notaData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error actualizando nota:', error);
      return null;
    }

    return data ? data[0] : null;
  }

  // Eliminar nota
  async eliminarNota(id: string) {
    const { error } = await this.supabaseService.getClient()
      .from('notas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando nota:', error);
      return false;
    }

    return true;
  }
}