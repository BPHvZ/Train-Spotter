import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TrainMapComponent} from './train-map/train-map.component';


const routes: Routes = [
  { path: 'train-map', component: TrainMapComponent, pathMatch: 'full' },
  { path: '',   redirectTo: '/train-map', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
