import { Component, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Disruption } from "../../../models/ReisinformatieAPI";

@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent {
	@Input() disruption: Disruption;
	@Output() flyToDisruption = new EventEmitter<Disruption>();
}
