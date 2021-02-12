import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DisruptionItemComponent } from "./disruption-item.component";

describe("DisruptionItemComponent", () => {
	let component: DisruptionItemComponent;
	let fixture: ComponentFixture<DisruptionItemComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [DisruptionItemComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
