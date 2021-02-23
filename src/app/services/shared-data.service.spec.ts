import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedDataService } from "./shared-data.service";

describe("SharedDataService", () => {
	let service: SharedDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
		});
		service = TestBed.inject(SharedDataService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
