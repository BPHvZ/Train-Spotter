import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CalamityItemComponent } from "./calamity-item.component";

describe("CalamityItemComponent", () => {
	let component: CalamityItemComponent;
	let fixture: ComponentFixture<CalamityItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CalamityItemComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CalamityItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
