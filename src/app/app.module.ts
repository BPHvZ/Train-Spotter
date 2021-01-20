import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TrainMapComponent } from "./components/train-map/train-map.component";

import { NgxMapboxGLModule } from "ngx-mapbox-gl";
import { MainLayoutComponent } from "./components/layout/main-layout/main-layout.component";
import { HeaderComponent } from "./components/layout/header/header.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientModule } from "@angular/common/http";
import { TrainPopupComponent } from "./components/train-popup/train-popup.component";
import { StationPopupComponent } from "./components/station-popup/station-popup.component";
import { AllStationsComponent } from "./components/all-stations/all-stations.component";
import { NgbdSortableHeaderDirective } from "./directives/ngbd-sortable-header.directive";
import { FormsModule } from "@angular/forms";
import { RouteReuseStrategy } from "@angular/router";
import { CacheRouteReuseStrategy } from "./cache-route-reuse.strategy";
import { TrainMapSidebarComponent } from "./components/train-map-sidebar/train-map-sidebar.component";

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
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: CacheRouteReuseStrategy,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
