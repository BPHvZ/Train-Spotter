import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";

describe("AppComponent", () => {
	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				imports: [RouterTestingModule, ServiceWorkerModule.register("ngsw-worker.js", { enabled: false })],
				declarations: [AppComponent],
			}).compileComponents();
		})
	);

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;

		expect(app).toBeTruthy();
	});

	it(`should have as title 'trainSpotter'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;

		expect(app.title).toEqual("trainSpotter");
	});
});
