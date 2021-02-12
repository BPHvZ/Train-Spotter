import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisruptionItemComponent } from "./disruption-item.component";

describe("DisruptionItemComponent", () => {
	let component: DisruptionItemComponent;
	let fixture: ComponentFixture<DisruptionItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DisruptionItemComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
