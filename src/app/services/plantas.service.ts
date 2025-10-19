import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { ImagenService } from './imagen.service';

export interface Cuidados {
  riego: string;
  luz: string;
  temperatura: string;
  suelo: string;
}

export interface Planta {
  id: number;
  nombre: string;
  nombreCientifico: string;
  tipo: string;
  cuidados: Cuidados;
  descripcion: string;
  imagen: string;
  imagenCargada?: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

interface ApiResponse {
  record: {
    plantas: Planta[];
    categorias: Categoria[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class PlantasService {
  // Configuración - REEMPLAZA CON TUS DATOS REALES
  private binId = '68f44bcdae596e708f1bd165';
  private apiKey = '$2a$10$bMAT0JNPdNE1ddYLihJew.BsWKMd9cSgYQ8ihw/iOA5IoxAPQBHtu';
  
  private apiUrl = `https://api.jsonbin.io/v3/b/${this.binId}/latest`;
  private headers = new HttpHeaders({
    'X-Master-Key': this.apiKey,
    'Content-Type': 'application/json'
  });

  private plantasCache: Planta[] | null = null;
  private categoriasCache: Categoria[] | null = null;

  constructor(
    private http: HttpClient,
    private imagenService: ImagenService
  ) { }

  private procesarImagenesPlantas(plantas: Planta[]): Planta[] {
    return plantas.map(planta => ({
      ...planta,
      imagen: this.imagenService.getImagenSegura(planta.imagen, planta.tipo)
    }));
  }

  getPlantas(): Observable<Planta[]> {
    if (this.plantasCache) {
      return new Observable(observer => {
        observer.next(this.plantasCache!);
        observer.complete();
      });
    }

    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => this.procesarImagenesPlantas(response.record.plantas)),
      tap(plantas => {
        this.plantasCache = plantas;
        // Precargar imágenes en segundo plano
        this.precargarImagenesPlantas(plantas);
      })
    );
  }

  getPlantaById(id: number): Observable<Planta | undefined> {
    return this.getPlantas().pipe(
      map(plantas => plantas.find(planta => planta.id === id))
    );
  }

  getCategorias(): Observable<Categoria[]> {
    if (this.categoriasCache) {
      return new Observable(observer => {
        observer.next(this.categoriasCache!);
        observer.complete();
      });
    }

    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers }).pipe(
      map(response => response.record.categorias),
      tap(categorias => this.categoriasCache = categorias)
    );
  }

  buscarPlantas(termino: string): Observable<Planta[]> {
    return this.getPlantas().pipe(
      map(plantas => plantas.filter(planta =>
        planta.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        planta.nombreCientifico.toLowerCase().includes(termino.toLowerCase()) ||
        planta.tipo.toLowerCase().includes(termino.toLowerCase()) ||
        planta.descripcion.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }

  getPlantasPorTipo(tipo: string): Observable<Planta[]> {
    return this.getPlantas().pipe(
      map(plantas => 
        tipo === 'todas' 
          ? plantas 
          : plantas.filter(planta => 
              planta.tipo.toLowerCase().includes(tipo.toLowerCase())
            )
      )
    );
  }

  private precargarImagenesPlantas(plantas: Planta[]): void {
    plantas.forEach(planta => {
      this.imagenService.precargarImagen(planta.imagen)
        .then(() => {
          planta.imagenCargada = true;
        })
        .catch(() => {
          planta.imagenCargada = false;
        });
    });
  }

  limpiarCache(): void {
    this.plantasCache = null;
    this.categoriasCache = null;
    this.imagenService.limpiarCache();
  }
}