import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TrainMapComponent} from './components/train-map/train-map.component';
import {AllStationsComponent} from './components/all-stations/all-stations.component';

const routes: Routes = [
  { path: 'kaart', component: TrainMapComponent },
  { path: 'stations', component: AllStationsComponent},
  { path: '',   redirectTo: '/kaart', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
