import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, Platform } from '@ionic/angular';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private supabaseService: SupabaseService
  ) { }

  // Tomar foto con cámara
  async takePhoto(): Promise<string> {
    if (this.isNativePlatform()) {
      return this.takePhotoNative();
    } else {
      return this.takePhotoWeb();
    }
  }

  // Elegir de galería
  async chooseFromGallery(): Promise<string> {
    if (this.isNativePlatform()) {
      return this.chooseFromGalleryNative();
    } else {
      return this.chooseFromGalleryWeb();
    }
  }

  // Método nativo para tomar foto
  private async takePhotoNative(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 70, // Reducir calidad para archivos más pequeños
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        correctOrientation: true
      });
      return image.dataUrl as string;
    } catch (error) {
      console.error('Error tomando foto nativa:', error);
      throw error;
    }
  }

  // Método nativo para galería
  private async chooseFromGalleryNative(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 70, // Reducir calidad para archivos más pequeños
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        correctOrientation: true
      });
      return image.dataUrl as string;
    } catch (error) {
      console.error('Error eligiendo de galería nativa:', error);
      throw error;
    }
  }

  // Método web para tomar foto
  private takePhotoWeb(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            resolve(e.target.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        } else {
          reject(new Error('No se seleccionó ningún archivo'));
        }
      };
      
      input.oncancel = () => {
        reject(new Error('Usuario canceló la selección'));
      };
      
      input.click();
    });
  }

  // Método web para galería
  private chooseFromGalleryWeb(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            resolve(e.target.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        } else {
          reject(new Error('No se seleccionó ningún archivo'));
        }
      };
      
      input.oncancel = () => {
        reject(new Error('Usuario canceló la selección'));
      };
      
      input.click();
    });
  }

  // SOLUCIÓN TEMPORAL: Guardar imagen como Base64 en la base de datos
  async saveImageToDatabase(imageData: string, userId: string): Promise<string> {
    try {
      console.log('Guardando imagen en base de datos...');
      
      // Reducir el tamaño si es muy grande (más de 500KB)
      const optimizedImage = await this.optimizeImageSize(imageData);
      
      // Guardar directamente como Base64 en la columna foto_perfil
      const { data, error } = await this.supabaseService.getClient()
        .from('usuarios')
        .update({ foto_perfil: optimizedImage })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error guardando imagen en BD:', error);
        throw error;
      }

      console.log('Imagen guardada exitosamente en base de datos');
      return optimizedImage;

    } catch (error) {
      console.error('Error guardando imagen:', error);
      throw error;
    }
  }

  // Optimizar tamaño de imagen
  private async optimizeImageSize(imageData: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Redimensionar si es muy grande
        let width = img.width;
        let height = img.height;
        const maxSize = 800;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Reducir calidad para hacer el archivo más pequeño
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(optimizedDataUrl);
        } else {
          resolve(imageData); // Fallback a la imagen original
        }
      };
      
      img.onerror = () => {
        resolve(imageData); // Fallback a la imagen original
      };
      
      img.src = imageData;
    });
  }

  // Método original para Supabase Storage (mantener para futuro)
  async uploadImageToSupabase(imageData: string, userId: string): Promise<string> {
    try {
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      const fileName = `profile_${userId}_${Date.now()}.jpg`;
      const filePath = `profiles/${fileName}`;

      const { data, error } = await this.supabaseService.getClient()
        .storage
        .from('user-profiles')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = this.supabaseService.getClient()
        .storage
        .from('user-profiles')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen a Supabase Storage:', error);
      // Fallback: guardar en base de datos
      return await this.saveImageToDatabase(imageData, userId);
    }
  }

  // Actualizar foto de perfil (usar método temporal)
  async updateUserProfileImage(userId: string, imageUrl: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('usuarios')
        .update({ foto_perfil: imageUrl })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error actualizando foto de perfil:', error);
      throw error;
    }
  }

  // Mostrar opciones para cambiar foto
  async showImageOptions(): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Cambiar Foto de Perfil',
        message: '¿Cómo quieres cambiar tu foto?',
        buttons: [
          {
            text: '📷 Tomar Foto',
            handler: async () => {
              try {
                const image = await this.takePhoto();
                resolve(image);
              } catch (error) {
                console.error('Error tomando foto:', error);
                this.presentAlert('Error', 'No se pudo tomar la foto.');
                resolve(null);
              }
            }
          },
          {
            text: '🖼️ Elegir de Galería',
            handler: async () => {
              try {
                const image = await this.chooseFromGallery();
                resolve(image);
              } catch (error) {
                console.error('Error eligiendo de galería:', error);
                this.presentAlert('Error', 'No se pudo acceder a la galería.');
                resolve(null);
              }
            }
          },
          {
            text: '❌ Cancelar',
            role: 'cancel',
            handler: () => resolve(null)
          }
        ]
      });

      await alert.present();
    });
  }

  // Verificar si estamos en dispositivo nativo
  isNativePlatform(): boolean {
    return this.platform.is('capacitor');
  }

  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}