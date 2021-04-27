import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MAPBOX_API_KEY, NgxMapboxGLModule } from "ngx-mapbox-gl";

/** Mapbox map config */
export interface TrainMapModuleModuleConfig {
	/** Mapbox access token */
	mapboxToken: string;
}

/** Provides the Mapbox */
@NgModule({
	declarations: [],
	exports: [],
	imports: [CommonModule, NgxMapboxGLModule],
})
export class TrainMapModuleModule {
	/**
	 * Implements in root
	 * @param config Mapbox config
	 * @return Module provider for mapbox
	 */
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
