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

import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Injectable({
	providedIn: "root",
})
export class MetaTagService {
	constructor(private meta: Meta, private titleService: Title) {}

	updateTags(componentName: string): void {
		if (componentName) {
			if (componentName == "all-stations") {
				this.titleService.setTitle("TrainSpotter - Alle Stations");
				this.meta.updateTag({
					name: "description",
					content:
						"TrainSpotter | Alle NS stations in binnen- en buitenland. Toont Stationsnaam, EVA code en UIC code",
				});
			}
			if (componentName == "about") {
				this.titleService.setTitle("TrainSpotter - Over TrainSpotter");
				this.meta.updateTag({
					name: "description",
					content:
						"TrainSpotter | TrainSpotter geeft informatie over de actuele situatie op het Nederlandse spoor. Met TrainSpotter zie je live treinposities van NS, Arriva, Blauwnet en R-net. Ook worden actuele storingen en werkzaamheden op het Nederlandse spoor getoond",
				});
			}
			if (componentName == "train-map") {
				this.titleService.setTitle(
					"TrainSpotter - Treinenkaart met live treinposities van NS, Arriva, Blauwnet en R-net"
				);
				this.meta.updateTag({
					name: "description",
					content:
						"TrainSpotter | TrainSpotter geeft informatie over de actuele situatie op het Nederlandse spoor. Met TrainSpotter zie je live treinposities van NS, Arriva, Blauwnet en R-net. Ook worden actuele storingen en werkzaamheden op het Nederlandse spoor getoond",
				});
			}
		}
	}
}
