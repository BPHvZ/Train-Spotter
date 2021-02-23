import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AllStationsComponent } from "./all-stations.component";

describe("AllStationsComponent", () => {
	let component: AllStationsComponent;
	let fixture: ComponentFixture<AllStationsComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [AllStationsComponent],
				imports: [HttpClientTestingModule, RouterTestingModule],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(AllStationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
