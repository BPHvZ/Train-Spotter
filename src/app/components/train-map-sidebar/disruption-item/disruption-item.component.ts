import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Disruption, DisruptionBase } from "../../../models/ReisinformatieAPI";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent {
	@Output() closeSidebar = new EventEmitter();
	@Input() disruption: Disruption;

	constructor(private sharedDataService: SharedDataService) {}

	flyToDisruption(disruption: DisruptionBase): void {
		if (this.sharedDataService.screenWidth <= 768) {
			this.closeSidebar.emit();
		}
		this.sharedDataService.flyToDisruption(disruption);
	}
}
