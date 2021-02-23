import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { TrainMapSidebarComponent } from "./train-map-sidebar.component";

describe("TrainMapSidebarComponent", () => {
	let component: TrainMapSidebarComponent;
	let fixture: ComponentFixture<TrainMapSidebarComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [TrainMapSidebarComponent],
				imports: [BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule],
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
