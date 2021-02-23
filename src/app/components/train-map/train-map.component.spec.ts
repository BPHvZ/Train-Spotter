import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TrainMapComponent } from "./train-map.component";

describe("TrainMapComponent", () => {
	let component: TrainMapComponent;
	let fixture: ComponentFixture<TrainMapComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [TrainMapComponent],
				imports: [HttpClientTestingModule, RouterTestingModule],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(TrainMapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
