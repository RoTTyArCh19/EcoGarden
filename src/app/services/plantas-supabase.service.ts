import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlantasSupabaseService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  // Obtener todas las plantas del usuario
  async getPlantas() {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) return [];

    const { data, error } = await this.supabaseService.getClient()
      .from('plantas')
      .select('*')
      .eq('usuario_id', usuario.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo plantas:', error);
      return [];
    }

    return data || [];
  }

  // Crear nueva planta
  async crearPlanta(planta: any) {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) return null;

    const plantaData = {
      ...planta,
      usuario_id: usuario.id
    };

    const { data, error } = await this.supabaseService.getClient()
      .from('plantas')
      .insert([plantaData])
      .select();

    if (error) {
      console.error('Error creando planta:', error);
      return null;
    }

    return data ? data[0] : null;
  }

  // Actualizar planta
  async actualizarPlanta(id: string, planta: any) {
    const { data, error } = await this.supabaseService.getClient()
      .from('plantas')
      .update(planta)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error actualizando planta:', error);
      return null;
    }

    return data ? data[0] : null;
  }

  // Eliminar planta
  async eliminarPlanta(id: string) {
    const { error } = await this.supabaseService.getClient()
      .from('plantas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando planta:', error);
      return false;
    }

    return true;
  }
}