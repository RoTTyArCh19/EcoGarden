import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {}

  crear() {
    if (this.dato.cultivador && this.dato.nombre && this.dato.tipo && this.dato.fecha) {
      if (this.editIndex !== null) {
        // Editando existente
        this.plantas[this.editIndex] = { ...this.dato };
        this.editIndex = null;
      } else {
        // Nuevo registro
        this.plantas.push({ ...this.dato });
      }
      this.limpiar();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  limpiar() {
    this.dato = { cultivador: '', nombre: '', tipo: '', fecha: '' };
    this.editIndex = null;
  }

  editar(index: number) {
    this.dato = { ...this.plantas[index] };
    this.editIndex = index;
  }

  eliminar(index: number) {
    this.plantas.splice(index, 1);
    if (this.editIndex === index) {
      this.limpiar();
    }
  }
}

