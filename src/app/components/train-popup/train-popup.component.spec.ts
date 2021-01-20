import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TrainPopupComponent } from "./train-popup.component";

describe("TrainPopupComponent", () => {
	let component: TrainPopupComponent;
	let fixture: ComponentFixture<TrainPopupComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [TrainPopupComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(TrainPopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
