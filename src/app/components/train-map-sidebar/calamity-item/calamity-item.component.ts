import { Component, Input } from "@angular/core";
import { Calamity } from "../../../models/Disruptions";

@Component({
	selector: "app-calamity-item",
	templateUrl: "./calamity-item.component.html",
	styleUrls: ["./calamity-item.component.sass"],
})
export class CalamityItemComponent {
	@Input() calamity: Calamity;
}
