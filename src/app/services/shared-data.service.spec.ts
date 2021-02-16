import { TestBed } from "@angular/core/testing";

import { SharedDataService } from "./shared-data.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

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
