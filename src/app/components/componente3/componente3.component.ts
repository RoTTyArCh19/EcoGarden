import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NotasSupabaseService } from 'src/app/services/notas-supabase.service';

@Component({
  selector: 'app-componente3',
  templateUrl: './componente3.component.html',
  styleUrls: ['./componente3.component.scss'],
  standalone: false,
})
export class Componente3Component implements OnInit {

  notes: any[] = [];
  currentNote: any = { title: '', content: '' };
  editingNote: boolean = false;
  editId: string | null = null;

  constructor(
    private alertController: AlertController,
    private notasService: NotasSupabaseService
  ) { }

  async ngOnInit() {
    await this.cargarNotas();
  }

  async cargarNotas() {
    this.notes = await this.notasService.getNotas();
  }

  // Método para obtener contenido truncado
  getShortContent(content: string): string {
    if (!content) return '';
    
    const limit = 50;
    if (content.length <= limit) {
      return content;
    }
    
    const lastSpace = content.substr(0, limit).lastIndexOf(' ');
    const truncated = content.substr(0, lastSpace > 0 ? lastSpace : limit);
    
    return `${truncated}...`;
  }

  async saveNote() {
    if (!this.currentNote.title || !this.currentNote.content) {
      this.presentAlert('Error', 'Por favor, completa el título y el contenido de la nota');
      return;
    }

    if (this.editingNote && this.editId) {
      // Actualizar nota existente
      const resultado = await this.notasService.actualizarNota(this.editId, this.currentNote);
      if (resultado) {
        this.presentAlert('Éxito', 'Nota actualizada correctamente');
        await this.cargarNotas();
      }
    } else {
      // Crear nueva nota
      const resultado = await this.notasService.crearNota(this.currentNote);
      if (resultado) {
        this.presentAlert('Éxito', 'Nota creada correctamente');
        await this.cargarNotas();
      }
    }

    this.resetForm();
  }

  // MÉTODO CORREGIDO - Cambiado de editNote a editarNota
  editarNota(note: any) {
    this.currentNote = {
      title: note.titulo,
      content: note.contenido
    };
    this.editingNote = true;
    this.editId = note.id;
    
    const formElement = document.querySelector('.note-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async confirmDelete(note: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar la nota "${note.titulo}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteNote(note.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteNote(id: string) {
    const resultado = await this.notasService.eliminarNota(id);
    if (resultado) {
      await this.cargarNotas();
      if (this.editingNote && this.editId === id) {
        this.resetForm();
      }
      this.presentAlert('Eliminada', 'Nota eliminada correctamente');
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.currentNote = { title: '', content: '' };
    this.editingNote = false;
    this.editId = null;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}