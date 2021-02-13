import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NgbdSortableHeaderDirective, SortEvent } from "../../directives/ngbd-sortable-header.directive";
import { Observable } from "rxjs";
import { StationsService } from "../../services/stations.service";
import { take } from "rxjs/operators";
import { Router } from "@angular/router";
import { Station } from "../../models/ReisinformatieAPI";

/**
 * Table with all NS-stations
 */
@Component({
	selector: "app-all-stations",
	templateUrl: "./all-stations.component.html",
	styleUrls: ["./all-stations.component.sass"],
	providers: [StationsService],
})
export class AllStationsComponent implements OnInit {
	stations$: Observable<Station[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

	constructor(public service: StationsService, private router: Router) {
		this.stations$ = service.stations$;
		this.total$ = service.total$;
	}

	/**
	 * Sort name ascending as default
	 */
	ngOnInit(): void {
		// only take the first two events, then unsubscribe
		this.service.stations$.pipe(take(2)).subscribe((r) => {
			if (r.length > 0) {
				this.headers.first.rotate();
			}
		});
	}

	/**
	 * Sort when table column header is clicked
	 * @param column Property name of {@link Station} to sort on
	 * @param direction Sort ascending or descending
	 */
	onSort({ column, direction }: SortEvent): void {
		// resetting other headers
		this.headers.forEach((header) => {
			if (header.appNgbdSortableHeader !== column) {
				header.direction = "";
			}
		});
		this.service.sortColumn = column;
		this.service.sortDirection = direction;
	}

	/**
	 * Change view to the train map and fly to a station
	 * @param station Fly to this station
	 */
	openStationOnMap(station: Station): void {
		void this.router.navigate(["kaart"], { state: { station } });
	}
}
