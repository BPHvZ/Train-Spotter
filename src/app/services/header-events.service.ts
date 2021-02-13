import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Station } from "../models/ReisinformatieAPI";

@Injectable({
	providedIn: "root",
})
export class HeaderEventsService {
	private selectedStationFromHeader = new BehaviorSubject<Station>(null);
	currentSelectedStation = this.selectedStationFromHeader.asObservable();

	selectStation(station: Station): void {
		this.selectedStationFromHeader.next(station);
	}
}
