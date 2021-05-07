import { AfterViewInit, Component } from "@angular/core";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

/** Page for information about TrainSpotter */
@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.sass"],
})
export class AboutComponent implements AfterViewInit {
	componentName = "about";
	/** External link icon */
	faExternalLinkAlt = faExternalLinkAlt;

	/** Init after DOM finished loading */
	ngAfterViewInit(): void {
		this.loadScript("https://buttons.github.io/buttons.js")
			.then(() => {
				return;
			})
			.catch(() => {
				return;
			});
	}

	/**
	 * Add and load JS script
	 * @param scriptUrl URL to the script
	 */
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
