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

import { Directive, Input, OnInit } from "@angular/core";

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: "[ngInit]",
	exportAs: "ngInit",
})
export class NgInitDirective implements OnInit {
	@Input() ngInit: () => any;
	ngOnInit(): void {
		console.log(typeof this.ngInit);
		if (typeof this.ngInit === "function") {
			this.ngInit();
		} else {
			// preventing re-evaluation (described below)
			throw "something";
		}
	}
}
