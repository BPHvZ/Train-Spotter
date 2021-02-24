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

import { registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import localeNL from "@angular/common/locales/nl";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouteReuseStrategy } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CacheRouteReuseStrategy } from "./cache-route-reuse.strategy";
import { AllStationsComponent } from "./components/all-stations/all-stations.component";
import { HeaderComponent } from "./components/layout/header/header.component";
import { MainLayoutComponent } from "./components/layout/main-layout/main-layout.component";
import { StationPopupComponent } from "./components/station-popup/station-popup.component";
import { CalamityItemComponent } from "./components/train-map-sidebar/calamity-item/calamity-item.component";
import { DisruptionItemComponent } from "./components/train-map-sidebar/disruption-item/disruption-item.component";
import { TrainMapSidebarComponent } from "./components/train-map-sidebar/train-map-sidebar.component";
import { TrainMapComponent } from "./components/train-map/train-map.component";
import { TrainPopupComponent } from "./components/train-popup/train-popup.component";
import { NgbdSortableHeaderDirective } from "./directives/ngbd-sortable-header.directive";

registerLocaleData(localeNL, "nl");

@NgModule({
	declarations: [
		AppComponent,
		TrainMapComponent,
		MainLayoutComponent,
		HeaderComponent,
		TrainPopupComponent,
		StationPopupComponent,
		AllStationsComponent,
		NgbdSortableHeaderDirective,
		TrainMapSidebarComponent,
		DisruptionItemComponent,
		CalamityItemComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgxMapboxGLModule.withConfig({
			accessToken: "pk.eyJ1IjoiYnBodnoiLCJhIjoiY2prbDQydXgyMXJtNzN2cGo3NnNsc3NuZSJ9.o33sEM09iHWvUNXKjKnBpA",
		}),
		NgbModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatIconModule,
		HttpClientModule,
		FormsModule,
		ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
		FontAwesomeModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: CacheRouteReuseStrategy,
		},
		{ provide: LOCALE_ID, useValue: "nl" },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
