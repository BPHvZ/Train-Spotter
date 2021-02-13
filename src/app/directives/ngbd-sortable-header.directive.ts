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
