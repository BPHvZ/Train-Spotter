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

/**Type SortColumn is all properties of a {@link Station} object*/
export type SortColumn = keyof Station | "";
/**Sort in any direction*/
export type SortDirection = "asc" | "desc" | "";
/**Go to the next sorting direction*/
const rotate: { [key: string]: SortDirection } = { asc: "desc", desc: "", "": "asc" };

/**Interface used when a header is clicked*/
export interface SortEvent {
	/**Column to sort*/
	column: SortColumn;
	/**Direction to sort in*/
	direction: SortDirection;
}

/**
 * Manages the sorting of the stations table
 */
@Directive({
	selector: "[appNgbdSortableHeader]",
})
export class NgbdSortableHeaderDirective {
	/**Column to sort*/
	@Input() appNgbdSortableHeader: SortColumn = "";
	/**Direction to sort column on*/
	@Input() direction: SortDirection = "";
	/**Notify to sort the stations*/
	@Output() sort = new EventEmitter<SortEvent>();

	/**
	 * Modify CSS class of column when sorting ascending
	 */
	@HostBinding("class.asc")
	get ascClass(): boolean {
		return this.direction === "asc";
	}

	/**
	 * Modify CSS class of column when sorting descending
	 */
	@HostBinding("class.desc")
	get descClass(): boolean {
		return this.direction === "desc";
	}

	/**
	 * Change sorting direction on column click
	 */
	@HostListener("click") onClick(): void {
		this.rotate();
	}

	/**
	 * Sort the column in the next sorting directions
	 */
	rotate(): void {
		this.direction = rotate[this.direction];
		this.sort.emit({ column: this.appNgbdSortableHeader, direction: this.direction });
	}
}
