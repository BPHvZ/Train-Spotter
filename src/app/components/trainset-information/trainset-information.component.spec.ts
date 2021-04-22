import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TrainsetInformationComponent } from "./trainset-information.component";

describe("TrainsetInformationComponent", () => {
	let component: TrainsetInformationComponent;
	let fixture: ComponentFixture<TrainsetInformationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TrainsetInformationComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TrainsetInformationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
