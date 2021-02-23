import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DisruptionItemComponent } from "./disruption-item.component";

describe("DisruptionItemComponent", () => {
	let component: DisruptionItemComponent;
	let fixture: ComponentFixture<DisruptionItemComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				imports: [HttpClientTestingModule, RouterTestingModule],
				declarations: [DisruptionItemComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
