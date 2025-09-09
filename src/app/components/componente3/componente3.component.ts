import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-componente3',
  templateUrl: './componente3.component.html',
  styleUrls: ['./componente3.component.scss'],
  standalone:false,
})
export class Componente3Component implements OnInit {

  notes: any[] = [];
  currentNote: any = { title: '', content: '' };
  editingNote: boolean = false;
  editIndex: number = -1;

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    // Cargar notas desde localStorage si existen
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  // Método para obtener contenido truncado
  getShortContent(content: string): string {
    if (!content) return '';
    
    const limit = 50;
    if (content.length <= limit) {
      return content;
    }
    
    // Encontrar el último espacio dentro del límite
    const lastSpace = content.substr(0, limit).lastIndexOf(' ');
    const truncated = content.substr(0, lastSpace > 0 ? lastSpace : limit);
    
    return `${truncated}...`;
  }

  saveNote() {
    if (!this.currentNote.title || !this.currentNote.content) {
      this.presentAlert('Error', 'Por favor, completa el título y el contenido de la nota');
      return;
    }

    if (this.editingNote) {
      // Actualizar nota existente
      this.currentNote.updated = new Date();
      this.notes[this.editIndex] = this.currentNote;
      this.presentAlert('Éxito', 'Nota actualizada correctamente');
    } else {
      // Crear nueva nota
      this.currentNote.created = new Date();
      this.currentNote.updated = new Date();
      this.notes.push({...this.currentNote});
      this.presentAlert('Éxito', 'Nota creada correctamente');
    }

    // Guardar en localStorage
    localStorage.setItem('notes', JSON.stringify(this.notes));
    
    // Resetear formulario
    this.resetForm();
  }

  editNote(index: number) {
    this.currentNote = {...this.notes[index]};
    this.editingNote = true;
    this.editIndex = index;
    
    // Desplazar hacia el formulario
    const formElement = document.querySelector('.note-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async confirmDelete(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar la nota "${this.notes[index].title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteNote(index);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(this.notes));
    
    if (this.editingNote && this.editIndex === index) {
      this.resetForm();
    }
    
    this.presentAlert('Eliminada', 'Nota eliminada correctamente');
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.currentNote = { title: '', content: '' };
    this.editingNote = false;
    this.editIndex = -1;
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