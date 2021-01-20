import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TrainMapSidebarComponent } from "./train-map-sidebar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("TrainMapSidebarComponent", () => {
	let component: TrainMapSidebarComponent;
	let fixture: ComponentFixture<TrainMapSidebarComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [TrainMapSidebarComponent],
				imports: [BrowserAnimationsModule],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(TrainMapSidebarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
