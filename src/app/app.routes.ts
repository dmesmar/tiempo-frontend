import { Routes } from '@angular/router';
import { TiempoComponent } from './components/tiempo-component/tiempo-component';


export const routes: Routes = [
  { path: '', redirectTo:'tiempo', pathMatch:'full' },
  {path: 'tiempo', component: TiempoComponent}
];