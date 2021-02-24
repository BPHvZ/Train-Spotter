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

import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from "@angular/core";
import { Station } from "../models/ReisinformatieAPI";

export type SortColumn = keyof Station | "";
export type SortDirection = "asc" | "desc" | "";
const rotate: { [key: string]: SortDirection } = { asc: "desc", desc: "", "": "asc" };

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}

@Directive({
	selector: "[appNgbdSortableHeader]",
})
export class NgbdSortableHeaderDirective {
	@Input() appNgbdSortableHeader: SortColumn = "";
	@Input() direction: SortDirection = "";
	@Output() sort = new EventEmitter<SortEvent>();

	@HostBinding("class.asc")
	get ascClass(): boolean {
		return this.direction === "asc";
	}

	@HostBinding("class.desc")
	get descClass(): boolean {
		return this.direction === "desc";
	}

	@HostListener("click") onClick(): void {
		this.rotate();
	}

	rotate(): void {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.appNgbdSortableHeader, direction: this.direction });
	}
}
