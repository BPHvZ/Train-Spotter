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

export enum ToastPosition {
	Left,
	Right,
	Center,
}

export interface Toast {
	textOrTpl: string | TemplateRef<any>;
	position: ToastPosition;
	classname?: string;
	delay?: number;
	autoHide?: boolean;
}

@Injectable({
	providedIn: "root",
})
export class ToastService {
	toastsLeft: Array<Toast> = [];
	toastsRight: Array<Toast> = [];
	toastsCenter: Array<Toast> = [];

	show(
		textOrTpl: string | TemplateRef<any>,
		position: ToastPosition = ToastPosition.Right,
		classname = "",
		delay = 5000,
		autoHide = true
	): void {
		switch (position) {
			case ToastPosition.Right:
				this.toastsRight.push({
					textOrTpl: textOrTpl,
					position: position,
					classname: classname,
					delay: delay,
					autoHide: autoHide,
				});
				break;
			case ToastPosition.Left:
				this.toastsLeft.push({
					textOrTpl: textOrTpl,
					position: position,
					classname: classname,
					delay: delay,
					autoHide: autoHide,
				});
				break;
			case ToastPosition.Center:
				this.toastsCenter.push({
					textOrTpl: textOrTpl,
					position: position,
					classname: classname,
					delay: delay,
					autoHide: autoHide,
				});
				break;
		}
	}

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
