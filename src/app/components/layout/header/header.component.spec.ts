import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbDropdown } from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [HeaderComponent, NgbDropdown],
				imports: [HttpClientTestingModule, RouterTestingModule],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
