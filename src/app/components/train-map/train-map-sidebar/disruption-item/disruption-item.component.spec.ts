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

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Disruption } from "../../../../models/ReisinformatieAPI";
import { DisruptionItemComponent } from "./disruption-item.component";

describe("DisruptionItemComponent", () => {
	let component: DisruptionItemComponent;
	let fixture: ComponentFixture<DisruptionItemComponent>;

	const disruption = {
		id: "6009850",
		type: "DISRUPTION",
		registrationTime: "2021-03-22T21:27:49+0100",
		releaseTime: "2021-03-22T21:27:49+0100",
		local: false,
		title: "Zwolle-Groningen; Zwolle-Leeuwarden",
		topic: "disruption_6009850_nl",
		isActive: true,
		start: "2021-03-22T21:11:00+0100",
		end: "2021-03-23T00:57:49+0100",
		phase: {
			id: "1b",
			label: "Gevolgen bekend",
		},
		impact: {
			value: 4,
		},
		expectedDuration: {
			description: "Dit duurt tot ongeveer 23:30 uur.",
			endTime: "2021-03-22T23:30:00+0100",
		},
		summaryAdditionalTravelTime: {
			label: "De extra reistijd is meer dan 60 minuten.",
			shortLabel: "Extra reistijd meer dan 60 min.",
			minimumDurationInMinutes: 60,
		},
		publicationSections: [
			{
				section: {
					stations: [
						{
							uicCode: "8400747",
							stationCode: "ZL",
							name: "Zwolle",
							coordinate: {
								lat: 52.5047225952148,
								lng: 6.09194421768188,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400435",
							stationCode: "MP",
							name: "Meppel",
							coordinate: {
								lat: 52.6908340454102,
								lng: 6.19750022888184,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400330",
							stationCode: "HGV",
							name: "Hoogeveen",
							coordinate: {
								lat: 52.7338905334473,
								lng: 6.47361087799072,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400100",
							stationCode: "BL",
							name: "Beilen",
							coordinate: {
								lat: 52.8547210693359,
								lng: 6.52111101150513,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400073",
							stationCode: "ASN",
							name: "Assen",
							coordinate: {
								lat: 52.9916648864746,
								lng: 6.57083320617676,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400297",
							stationCode: "HRN",
							name: "Haren",
							coordinate: {
								lat: 53.1761093139648,
								lng: 6.61722230911255,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400238",
							stationCode: "GERP",
							name: "Groningen Europapark",
							coordinate: {
								lat: 53.20480027,
								lng: 6.5854178,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400263",
							stationCode: "GN",
							name: "Groningen",
							coordinate: {
								lat: 53.2105560302734,
								lng: 6.56472206115723,
							},
							countryCode: "NL",
						},
					],
					direction: "BOTH",
				},
				consequence: {
					section: {
						stations: [
							{
								uicCode: "8400747",
								stationCode: "ZL",
								name: "Zwolle",
								coordinate: {
									lat: 52.5047225952148,
									lng: 6.09194421768188,
								},
								countryCode: "NL",
							},
							{
								uicCode: "8400435",
								stationCode: "MP",
								name: "Meppel",
								coordinate: {
									lat: 52.6908340454102,
									lng: 6.19750022888184,
								},
								countryCode: "NL",
							},
						],
						direction: "ONE_WAY",
					},
					description: "geen treinen",
					level: "NO_OR_MUCH_LESS_TRAINS",
				},
			},
			{
				section: {
					stations: [
						{
							uicCode: "8400747",
							stationCode: "ZL",
							name: "Zwolle",
							coordinate: {
								lat: 52.5047225952148,
								lng: 6.09194421768188,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400435",
							stationCode: "MP",
							name: "Meppel",
							coordinate: {
								lat: 52.6908340454102,
								lng: 6.19750022888184,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400578",
							stationCode: "SWK",
							name: "Steenwijk",
							coordinate: {
								lat: 52.7915109924316,
								lng: 6.11455576324463,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400705",
							stationCode: "WV",
							name: "Wolvega",
							coordinate: {
								lat: 52.8808326721191,
								lng: 6.00361108779907,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400305",
							stationCode: "HR",
							name: "Heerenveen",
							coordinate: {
								lat: 52.9613876342773,
								lng: 5.91416645050049,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400049",
							stationCode: "AKM",
							name: "Akkrum",
							coordinate: {
								lat: 53.0463905334473,
								lng: 5.84361124038696,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400266",
							stationCode: "GW",
							name: "Grou-Jirnsum",
							coordinate: {
								lat: 53.0888900756836,
								lng: 5.82250022888184,
							},
							countryCode: "NL",
						},
						{
							uicCode: "8400387",
							stationCode: "LW",
							name: "Leeuwarden",
							coordinate: {
								lat: 53.1958351135254,
								lng: 5.79222202301025,
							},
							countryCode: "NL",
						},
					],
					direction: "BOTH",
				},
				consequence: {
					section: {
						stations: [
							{
								uicCode: "8400747",
								stationCode: "ZL",
								name: "Zwolle",
								coordinate: {
									lat: 52.5047225952148,
									lng: 6.09194421768188,
								},
								countryCode: "NL",
							},
							{
								uicCode: "8400435",
								stationCode: "MP",
								name: "Meppel",
								coordinate: {
									lat: 52.6908340454102,
									lng: 6.19750022888184,
								},
								countryCode: "NL",
							},
						],
						direction: "ONE_WAY",
					},
					description: "geen treinen",
					level: "NO_OR_MUCH_LESS_TRAINS",
				},
			},
		],
		timespans: [
			{
				start: "2021-03-22T21:11:00+0100",
				end: "2021-03-23T00:57:49+0100",
				situation: {
					label: "Tussen Zwolle en Meppel rijden er geen treinen door een stroomstoring.",
				},
				cause: {
					label: "Stroomstoring",
				},
				additionalTravelTime: {
					label: "De extra reistijd is meer dan 60 minuten.",
					shortLabel: "Extra reistijd meer dan 60 min.",
					minimumDurationInMinutes: 60,
				},
				advices: [],
			},
		],
	} as Disruption;

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
		component.disruption = disruption;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
