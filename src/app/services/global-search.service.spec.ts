import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { GlobalSearchService } from "./global-search.service";

describe("GlobalSearchService", () => {
	let service: GlobalSearchService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
		});
		service = TestBed.inject(GlobalSearchService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
