/*
 * trainSpotter
 * Copyright (C) 2021 bart
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable, TemplateRef } from "@angular/core";

/** Position of a toast notification */
export enum ToastPosition {
	Left,
	Right,
	Center,
}

/** Toast notification */
export interface Toast {
	/** Toast content, text or template */
	textOrTpl: string | TemplateRef<any>;
	/** Position where to show the toast */
	position: ToastPosition;
	/** Add style classes to the toast */
	classname?: string;
	/** Milliseconds to show the toast */
	delay?: number;
	/** Automatically remove the toast or not */
	autoHide?: boolean;
}

/** Service to show and remove toast notifications on the screen */
@Injectable({
	providedIn: "root",
})
export class ToastService {
	/** All toasts on the left side of the screen */
	toastsLeft: Array<Toast> = [];
	/** All toasts on the right side of the screen */
	toastsRight: Array<Toast> = [];
	/** All toasts in the center of the screen */
	toastsCenter: Array<Toast> = [];

	/**
	 * Show a toast notification
	 * @param toast The toast notification
	 */
	show(toast: Toast): void {
		toast.delay = toast.delay ?? 5000;
		toast.autoHide = toast.autoHide ?? true;
		switch (toast.position) {
			case ToastPosition.Right:
				this.toastsRight.push(toast);
				break;
			case ToastPosition.Left:
				this.toastsLeft.push(toast);
				break;
			case ToastPosition.Center:
				this.toastsCenter.push(toast);
				break;
		}
	}

	/**
	 * Remove a toast from the screen and service
	 * @param toast The toast to remove
	 */
	remove(toast: Toast): void {
		switch (toast.position) {
			case ToastPosition.Right:
				this.toastsRight = this.toastsRight.filter((t) => t !== toast);
				break;
			case ToastPosition.Left:
				this.toastsLeft = this.toastsLeft.filter((t) => t !== toast);
				break;
			case ToastPosition.Center:
				this.toastsCenter = this.toastsCenter.filter((t) => t !== toast);
				break;
		}
	}
}
