import { TestBed } from "@angular/core/testing";
import { TrainsetInformationResolver } from "./trainset-information.resolver";

describe("TrainsetInformationResolver", () => {
	let resolver: TrainsetInformationResolver;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		resolver = TestBed.inject(TrainsetInformationResolver);
	});

	it("should be created", () => {
		expect(resolver).toBeTruthy();
	});
});
