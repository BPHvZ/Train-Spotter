import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { RideInformationService } from "./ride-information.service";

describe("RideInformationService", () => {
	let service: RideInformationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
		});
		service = TestBed.inject(RideInformationService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
