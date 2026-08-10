import { Component, inject, OnInit, signal } from '@angular/core';
import { TiempoService } from '../../service/tiempo-service';
import { MunicipioDTO } from '../../models/municipio/municipio-model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PrecipitacionDTO, PrediccionDTO } from '../../models/prediccion/prediccion-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tiempo-component',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './tiempo-component.html',
  styleUrl: './tiempo-component.css',
})
export class TiempoComponent implements OnInit {

  private tiempoService = inject(TiempoService);
  protected readonly municipios = signal<MunicipioDTO[]>([]);
  protected readonly prediccion = signal<PrediccionDTO | null>(null);
  protected readonly errorMunicipios = signal<boolean>(false);
  protected readonly errorMunicipiosMsg = signal<string>('');
  protected readonly prediccionError = signal<boolean>(false);
  protected readonly prediccionErrorMsg = signal<string>('');
  protected readonly municipioSeleccionado = signal<MunicipioDTO | null>(null);
  protected readonly fechaManana = this.calcularFechaManana();
  myControl = new FormControl<string | MunicipioDTO | null>('');
  protected readonly cargando = signal<boolean>(false);
  protected grupoVisible = signal<Record<number, boolean>>({ 1: false, 2: false, 3: false });

  protected gradosSeleccionados: string | null = null;
  filteredOptions!: Observable<MunicipioDTO[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(750),
      switchMap(valor => this.buscarMunicipios(typeof valor === 'string' ? valor : valor?.nombre || ''))
    );
  }

  protected existeGrupo1(p: PrediccionDTO): boolean {
    return p.probPrecipitacion.some(x => x.periodo === '00-24');
  }

  protected existeGrupo2(p: PrediccionDTO): boolean {
    const periodos = p.probPrecipitacion.map(x => x.periodo);
    return periodos.includes('00-12') && periodos.includes('12-24');
  }

  protected existeGrupo3(p: PrediccionDTO): boolean {
    const periodos = p.probPrecipitacion.map(x => x.periodo);
    return ['00-06', '06-12', '12-18', '18-24'].every(per => periodos.includes(per));
  }

  protected toggleGrupo(n: number): void {
    this.grupoVisible.update(v => ({ ...v, [n]: !v[n] }));
  }

  protected filtrarGrupo(p: PrediccionDTO, n: number): PrecipitacionDTO[] {
    const periodosPorGrupo: Record<number, string[]> = {
      1: ['00-24'],
      2: ['00-12', '12-24'],
      3: ['00-06', '06-12', '12-18', '18-24']
    };
    return p.probPrecipitacion.filter(x => periodosPorGrupo[n].includes(x.periodo));
  }

  private buscarMunicipios(nombre: string): Observable<MunicipioDTO[]> {
      if (!nombre) {
        return of([]);
      }
      this.cargando.set(true);
      return this.tiempoService.getListaMunicipios(nombre).pipe(
        tap(() => {
          this.errorMunicipios.set(false);
          this.cargando.set(false);
        }),
        catchError(err => {
          this.errorMunicipios.set(true);
          this.errorMunicipiosMsg.set(err.error?.message ?? 'No se han podido buscar los municipios. Es posible que el servicio esté saturado; inténtalo de nuevo en unos minutos.');
          this.cargando.set(false);
          return of([]);
        })
      );
  }

  mostrarNombre(municipio: MunicipioDTO): string {
    return municipio?.nombre ?? '';
  }

  onSelectMunicipio() {
    const municipio = this.myControl.value;
    this.municipioSeleccionado.set(typeof municipio === 'string' ? null : municipio);
    this.llamarServicio();
  }

  onSelectGrados(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.gradosSeleccionados = select.value;
    this.llamarServicio();
  }

  private llamarServicio() {
    let idMunicipio = this.getIdMunicipioActual();
    if (idMunicipio) {
        let grado = this.gradosSeleccionados;
        if (!grado) grado = "0";
        this.cargando.set(true);
        this.tiempoService.getPrediccion(idMunicipio, parseInt(grado)).subscribe({
          next: (respuesta) => {
            this.prediccion.set(respuesta);
            this.prediccionError.set(false);
            this.cargando.set(false);
          },
          error: (err) => {
            console.error('Error al obtener la predicción del tiempo', err);
            this.prediccion.set(null);
            this.prediccionError.set(true);
            this.prediccionErrorMsg.set(err.error?.message ?? 'No se ha podido obtener la predicción. Es posible que el servicio esté saturado; inténtalo de nuevo en unos minutos.');
            this.cargando.set(false);
          }
        });
      }
  }

  private getIdMunicipioActual(): string | null {
    const municipio = this.myControl.value;
    return typeof municipio === 'string' ? null : municipio?.id_old ?? null;
  }

  private calcularFechaManana(): string {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const texto = manana.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}