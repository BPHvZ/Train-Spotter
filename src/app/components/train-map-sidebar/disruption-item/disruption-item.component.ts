import { Component, Input } from "@angular/core";
import { Disruption, DisruptionBase } from "../../../models/ReisinformatieAPI";
import { SharedDataService } from "../../../services/shared-data.service";

@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent {
	@Input() disruption: Disruption;

	constructor(private sharedDataService: SharedDataService) {}

	flyToDisruption(disruption: DisruptionBase): void {
		this.sharedDataService.flyToDisruption(disruption);
	}
}
