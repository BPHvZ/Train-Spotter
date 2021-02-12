import { Component, Input, OnInit, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { Disruption } from "../../../models/Disruptions";

@Component({
	selector: "app-disruption-item",
	templateUrl: "./disruption-item.component.html",
	styleUrls: ["./disruption-item.component.sass"],
})
export class DisruptionItemComponent implements OnInit {
	@Input() disruption: Disruption;
	@Output() flyToDisruption = new EventEmitter<Disruption>();

	ngOnInit(): void {
		console.log(this.disruption);
	}
}
