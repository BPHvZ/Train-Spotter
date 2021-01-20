import { TestBed } from "@angular/core/testing";

import { HeaderEventsService } from "./header-events.service";

describe("HeaderEventsService", () => {
	let service: HeaderEventsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(HeaderEventsService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
