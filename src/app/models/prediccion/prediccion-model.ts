

export interface PrediccionDTO {
    mediaTemperatura: number;
    unidadTemperatura: string;
    probPrecipitacion: Array<PrecipitacionDTO>;
}
export interface PrecipitacionDTO {
  periodo: string;
  value: number;
}