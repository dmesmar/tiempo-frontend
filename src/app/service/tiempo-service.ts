import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MunicipioDTO } from '../models/municipio/municipio-model';
import { PrediccionDTO } from '../models/prediccion/prediccion-model';

@Injectable({
    providedIn: 'root'
})
export class TiempoService {

    private http = inject(HttpClient);

    public getListaMunicipios(nombre: string): Observable<MunicipioDTO[]> {
        const url = environment.urlBack + 'api/v1/tiempo/getListaMunicipios';
        let params = new HttpParams().set("nombre", nombre);
        return this.http.get<MunicipioDTO[]>(url, {params});
    }

    public getPrediccion(id: string, grado: number): Observable<PrediccionDTO> {
        const url = environment.urlBack + 'api/v1/tiempo/getPrediccion';
        let params = new HttpParams().set("id", id).set("grado", grado);
        return this.http.get<PrediccionDTO>(url, {params})
    }
}