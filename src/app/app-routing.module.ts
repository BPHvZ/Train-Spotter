/*
 * trainSpotter
 * Copyright (C) 2021 bart
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./components/about/about.component";
import { AllStationsComponent } from "./components/all-stations/all-stations.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { RideInformationComponent } from "./components/ride-information/ride-information.component";
import { TrainMapComponent } from "./components/train-map/train-map/train-map.component";
import { TrainsetInformationComponent } from "./components/trainset-information/trainset-information.component";
import { RideInformationResolver } from "./resolvers/ride-information.resolver";
import { TrainsetInformationResolver } from "./resolvers/trainset-information.resolver";

const routes: Routes = [
	{
		path: "kaart",
		component: TrainMapComponent,
		data: {
			reuse: true,
		},
	},
	{
		path: "stations",
		component: AllStationsComponent,
		data: {
			reuse: true,
		},
	},
	{
		path: "rit/:rideId",
		component: RideInformationComponent,
		resolve: {
			rideInformation: RideInformationResolver,
		},
		runGuardsAndResolvers: "paramsOrQueryParamsChange",
		data: {
			reuse: false,
		},
	},
	{
		path: "materiaal/:trainset",
		component: TrainsetInformationComponent,
		resolve: {
			rideInformation: TrainsetInformationResolver,
		},
		runGuardsAndResolvers: "paramsOrQueryParamsChange",
		data: {
			reuse: false,
		},
	},
	{
		path: "over",
		component: AboutComponent,
		data: {
			reuse: false,
		},
	},
	{ path: "", redirectTo: "/kaart", pathMatch: "full" },
	{
		path: "**",
		component: PageNotFoundComponent,
		data: {
			reuse: false,
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
