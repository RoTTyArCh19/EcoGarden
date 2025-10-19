import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlantasService, Planta, Categoria } from 'src/app/services/plantas.service';
import { ImagenService } from 'src/app/services/imagen.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-wiki-plantas',
  templateUrl: './wiki-plantas.component.html',
  styleUrls: ['./wiki-plantas.component.scss'],
  standalone: false,
})
export class WikiPlantasComponent implements OnInit, OnDestroy {
  // Propiedades de estado
  cargando: boolean = false;
  error: string = '';
  
  // Datos
  plantas: Planta[] = [];
  plantasFiltradas: Planta[] = [];
  categorias: Categoria[] = [];
  plantaSeleccionada: Planta | null = null;
  
  // Filtros y búsqueda
  terminoBusqueda: string = '';
  tipoFiltro: string = 'todas';
  
  // Estados de imágenes
  imagenesCargando: { [key: number]: boolean } = {};
  
  private destroy$ = new Subject<void>();

  constructor(
    private plantasService: PlantasService,
    private imagenService: ImagenService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========== MÉTODOS DE CARGA DE DATOS ==========
  private cargarDatos(): void {
    this.cargando = true;
    this.error = '';

    this.plantasService.getPlantas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plantas) => {
          this.plantas = plantas;
          this.plantasFiltradas = plantas;
          this.cargando = false;
          this.cargarCategorias();
        },
        error: (error) => {
          this.error = this.obtenerMensajeError(error);
          this.cargando = false;
          console.error('Error cargando plantas:', error);
        }
      });
  }

  private cargarCategorias(): void {
    this.plantasService.getCategorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
        },
        error: (error) => {
          console.error('Error cargando categorías:', error);
        }
      });
  }

  // ========== MÉTODOS DE BÚSQUEDA Y FILTRADO ==========
  buscarPlantas(): void {
    if (this.terminoBusqueda.trim()) {
      this.cargando = true;
      this.plantasService.buscarPlantas(this.terminoBusqueda)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (plantas) => {
            this.plantasFiltradas = plantas;
            this.cargando = false;
          },
          error: (error) => {
            this.cargando = false;
            console.error('Error buscando plantas:', error);
          }
        });
    } else {
      this.aplicarFiltros();
    }
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoFiltro = tipo;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    if (this.tipoFiltro === 'todas' && !this.terminoBusqueda.trim()) {
      this.plantasFiltradas = this.plantas;
      return;
    }

    this.cargando = true;
    this.plantasService.getPlantasPorTipo(this.tipoFiltro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plantas) => {
          if (this.terminoBusqueda.trim()) {
            this.plantasFiltradas = plantas.filter(planta =>
              planta.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
              planta.nombreCientifico.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
            );
          } else {
            this.plantasFiltradas = plantas;
          }
          this.cargando = false;
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error filtrando plantas:', error);
        }
      });
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.tipoFiltro = 'todas';
    this.plantaSeleccionada = null;
    this.aplicarFiltros();
  }

  // ========== MÉTODOS DE SELECCIÓN Y NAVEGACIÓN ==========
  seleccionarPlanta(planta: Planta): void {
    this.plantaSeleccionada = planta;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========== MÉTODOS DE MANEJO DE IMÁGENES ==========
  manejarErrorImagen(event: any, planta: Planta): void {
    const placeholder = this.imagenService.getPlaceholder(planta.tipo);
    event.target.src = placeholder;
    planta.imagen = placeholder;
  }

  imagenCargando(plantaId: number): void {
    this.imagenesCargando[plantaId] = true;
  }

  imagenCargada(plantaId: number): void {
    this.imagenesCargando[plantaId] = false;
  }

  // ========== MÉTODOS DE UTILIDAD ==========
  obtenerTiposUnicos(): string[] {
    const tipos = [...new Set(this.plantas.map(p => p.tipo))];
    return tipos.sort();
  }

  getTotalPlantas(): number {
    return this.plantas.length;
  }

  getPlantasMostradas(): number {
    return this.plantasFiltradas.length;
  }

  private obtenerMensajeError(error: any): string {
    if (error.status === 0) {
      return 'Error de conexión. Verifica tu internet.';
    } else if (error.status === 401) {
      return 'Error de autenticación. Verifica tu API Key.';
    } else if (error.status === 404) {
      return 'No se encontró la base de datos. Verifica el Bin ID.';
    } else {
      return 'Error al cargar los datos. Intenta nuevamente.';
    }
  }

  recargar(): void {
    this.plantasService.limpiarCache();
    this.cargarDatos();
  }
}