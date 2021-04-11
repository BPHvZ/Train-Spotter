declare const require: any;

import { AfterViewInit, Component, OnInit } from "@angular/core";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.sass"],
})
export class AboutComponent implements OnInit, AfterViewInit {
	faExternalLinkAlt = faExternalLinkAlt;

	ngOnInit(): void {
		console.log();
	}

	ngAfterViewInit(): void {
		this.loadScript("https://buttons.github.io/buttons.js")
			.then(() => {
				return;
			})
			.catch(() => {
				return;
			});
	}

	loadScript(scriptUrl: string): Promise<void> {
		const script = document.createElement("script");
		script.src = scriptUrl;
		document.body.appendChild(script);

		return new Promise((res, rej) => {
			script.onload = function () {
				res();
			};
			script.onerror = function () {
				rej();
			};
		});
	}
}
