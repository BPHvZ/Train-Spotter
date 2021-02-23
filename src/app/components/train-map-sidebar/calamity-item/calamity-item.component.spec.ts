import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CalamityItemComponent } from "./calamity-item.component";

describe("CalamityItemComponent", () => {
	let component: CalamityItemComponent;
	let fixture: ComponentFixture<CalamityItemComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [CalamityItemComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(CalamityItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
