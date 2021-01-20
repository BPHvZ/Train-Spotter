import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StationPayload } from "../models/Station";

@Injectable({
	providedIn: "root",
})
export class HeaderEventsService {
	private selectedStationFromHeader = new BehaviorSubject<StationPayload>(null);
	currentSelectedStation = this.selectedStationFromHeader.asObservable();

	selectStation(station: StationPayload): void {
		this.selectedStationFromHeader.next(station);
	}
}
