import { TestBed } from "@angular/core/testing";
import { RideInformationService } from "./ride-information.service";

describe("RideInformationService", () => {
	let service: RideInformationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RideInformationService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
