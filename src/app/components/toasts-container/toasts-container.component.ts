import { Component, TemplateRef } from "@angular/core";
import { Toast, ToastService } from "../../services/toast.service";

@Component({
	selector: "app-toasts-container",
	templateUrl: "./toasts-container.component.html",
	styleUrls: ["./toasts-container.component.sass"],
})
export class ToastsContainerComponent {
	constructor(public toastService: ToastService) {}

	isTemplate(toast: Toast): boolean {
		return toast.textOrTpl instanceof TemplateRef;
	}
}
