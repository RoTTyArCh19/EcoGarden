import { Component, OnInit } from '@angular/core';
import { PlantasSupabaseService } from 'src/app/services/plantas-supabase.service';

@Component({
  selector: 'app-componente2',
  templateUrl: './componente2.component.html',
  styleUrls: ['./componente2.component.scss'],
  standalone: false,
})
export class Componente2Component implements OnInit {

  tipos: string[] = ['Flor', 'Verdura', 'Árbol'];

  dato: any = {
    cultivador: '',
    nombre: '',
    tipo: '',
    fecha: ''
  };

  plantas: any[] = [];
  editIndex: number | null = null;
  editId: string | null = null;

  constructor(private plantasService: PlantasSupabaseService) {}

  async ngOnInit() {
    await this.cargarPlantas();
  }

  async cargarPlantas() {
    this.plantas = await this.plantasService.getPlantas();
  }

  async crear() {
    if (this.dato.cultivador && this.dato.nombre && this.dato.tipo && this.dato.fecha) {
      if (this.editId !== null) {
        // Editando existente
        const resultado = await this.plantasService.actualizarPlanta(this.editId, this.dato);
        if (resultado) {
          await this.cargarPlantas();
        }
      } else {
        // Nuevo registro
        const resultado = await this.plantasService.crearPlanta(this.dato);
        if (resultado) {
          await this.cargarPlantas();
        }
      }
      this.limpiar();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  limpiar() {
    this.dato = { cultivador: '', nombre: '', tipo: '', fecha: '' };
    this.editIndex = null;
    this.editId = null;
  }

  editar(index: number) {
    this.dato = { ...this.plantas[index] };
    this.editIndex = index;
    this.editId = this.plantas[index].id;
  }

  async eliminar(index: number) {
    const planta = this.plantas[index];
    const resultado = await this.plantasService.eliminarPlanta(planta.id);
    
    if (resultado) {
      await this.cargarPlantas();
      if (this.editIndex === index) {
        this.limpiar();
      }
    }
  }
}