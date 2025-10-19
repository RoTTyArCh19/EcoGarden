import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private placeholders = [
    'https://hortuspaisajistas.com/wp-content/uploads/2021/06/plantas-trepadoras-y-enredaderas.jpg',
    'https://www.decorgreenchile.cl/wp-content/uploads/2023/06/CACTUS-SOUVENIR...jpg=80',
    'https://verdecora.es/blog/wp-content/uploads/2016/01/arbustos-invierno-verdecora.jpg?v=1717668359',
    'https://media.admagazine.com/photos/618a5e67a9f7fab6f0622b5e/1:1/w_1081,h_1081,c_limit/93263.jpg',
    'https://tallotaller.cl/wp-content/uploads/2019/06/Ficus-alii-plantas-de-interior-grandes-Tallo-Taller.jpg',
    'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/3D5F/production/_92211751_arbol1.jpg.webp'
  ];

  private imagenCache = new Map<string, string>();

  getPlaceholder(tipoPlanta?: string): string {
    // Asignar placeholder según el tipo de planta
    const placeholdersPorTipo: { [key: string]: string } = {
      'suculenta': 'https://media.admagazine.com/photos/618a5e67a9f7fab6f0622b5e/1:1/w_1081,h_1081,c_limit/93263.jpg',
      'cactus': 'https://www.decorgreenchile.cl/wp-content/uploads/2023/06/CACTUS-SOUVENIR...jpg',
      'arbusto': 'https://verdecora.es/blog/wp-content/uploads/2016/01/arbustos-invierno-verdecora.jpg?v=1717668359',
      'interior': 'https://tallotaller.cl/wp-content/uploads/2019/06/Ficus-alii-plantas-de-interior-grandes-Tallo-Taller.jpg',
      'trepadora': 'https://hortuspaisajistas.com/wp-content/uploads/2021/06/plantas-trepadoras-y-enredaderas.jpg',
      'árbol': 'https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/3D5F/production/_92211751_arbol1.jpg.webp'
    };

    if (tipoPlanta && placeholdersPorTipo[tipoPlanta.toLowerCase()]) {
      return placeholdersPorTipo[tipoPlanta.toLowerCase()];
    }

    const randomIndex = Math.floor(Math.random() * this.placeholders.length);
    return this.placeholders[randomIndex];
  }

  getImagenSegura(imagenUrl: string, tipoPlanta?: string): string {
    // Verificar si la URL es válida
    if (!imagenUrl || 
        imagenUrl.includes('undefined') || 
        imagenUrl.includes('null') ||
        !imagenUrl.startsWith('http')) {
      return this.getPlaceholder(tipoPlanta);
    }

    // Verificar si ya tenemos esta imagen en cache
    if (this.imagenCache.has(imagenUrl)) {
      return this.imagenCache.get(imagenUrl)!;
    }

    return imagenUrl;
  }

  precargarImagen(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!url || !url.startsWith('http')) {
        reject(new Error('URL inválida'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.imagenCache.set(url, url);
        resolve();
      };
      img.onerror = () => {
        const placeholder = this.getPlaceholder();
        this.imagenCache.set(url, placeholder);
        reject(new Error('Error al cargar imagen'));
      };
      img.src = url;
    });
  }

  limpiarCache(): void {
    this.imagenCache.clear();
  }
}