import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MAPBOX_API_KEY, NgxMapboxGLModule } from "ngx-mapbox-gl";

export interface TrainMapModuleModuleConfig {
	mapboxToken: string;
}

@NgModule({
	declarations: [],
	exports: [],
	imports: [CommonModule, NgxMapboxGLModule],
})
export class TrainMapModuleModule {
	static forRoot(config: TrainMapModuleModuleConfig): ModuleWithProviders<TrainMapModuleModule> {
		return {
			ngModule: TrainMapModuleModule,
			providers: [
				{
					provide: MAPBOX_API_KEY,
					useValue: config.mapboxToken,
				},
			],
		};
	}
}
