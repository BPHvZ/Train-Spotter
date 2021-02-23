import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { StationsService } from "./stations.service";

describe("StationsService", () => {
	let service: StationsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
		});
		service = TestBed.inject(StationsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
