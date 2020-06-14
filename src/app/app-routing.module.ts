import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TrainMapComponent} from './components/train-map/train-map.component';
import {AllStationsComponent} from './components/all-stations/all-stations.component';

const routes: Routes = [
  { path: 'kaart', component: TrainMapComponent, pathMatch: 'full' },
  { path: 'stations', component: AllStationsComponent, pathMatch: 'full' },
  { path: '',   redirectTo: '/stations', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
