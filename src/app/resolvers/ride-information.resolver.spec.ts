/*
 * trainSpotter
 * Copyright (C) 2021 bart
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed } from "@angular/core/testing";
import { RideinformationResolver } from "./ride-information.resolver";

describe("RideinformationResolver", () => {
	let resolver: RideinformationResolver;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		resolver = TestBed.inject(RideinformationResolver);
	});

	it("should be created", () => {
		expect(resolver).toBeTruthy();
	});
});
