import { Component, TemplateRef } from "@angular/core";
import { Toast, ToastService } from "../../services/toast.service";

/** Show toast notifications */
@Component({
	selector: "app-toasts-container",
	templateUrl: "./toasts-container.component.html",
	styleUrls: ["./toasts-container.component.sass"],
})
export class ToastsContainerComponent {
	/**
	 * Define services
	 * @param toastService Show toast notifications
	 */
	constructor(public toastService: ToastService) {}

	/**
	 * Whether a toast uses a Template or not
	 * @param toast Toast to check
	 * @return boolean Toast uses a Template or not
	 */
	isTemplate(toast: Toast): boolean {
		return toast.textOrTpl instanceof TemplateRef;
	}
}
