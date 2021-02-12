import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DisruptionItemComponent } from "./disruption-item.component";
import { parseJson } from "@angular/cli/utilities/json-file";
import { Disruption } from "../../../models/Disruptions";

describe("DisruptionItemComponent", () => {
	let component: DisruptionItemComponent;
	let fixture: ComponentFixture<DisruptionItemComponent>;

	beforeEach(
		waitForAsync(() => {
			void TestBed.configureTestingModule({
				declarations: [DisruptionItemComponent],
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionItemComponent);
		component = fixture.componentInstance;
		const json = `{
        "id": "6009264",
        "type": "DISRUPTION",
        "registrationTime": "2021-02-12T08:05:23+0100",
        "releaseTime": "2021-02-12T08:05:23+0100",
        "local": false,
        "title": "'s-Hertogenbosch-Eindhoven",
        "topic": "disruption_6009264_nl",
        "isActive": true,
        "start": "2021-02-12T02:25:00+0100",
        "end": "2021-02-12T10:35:23+0100",
        "phase": {
            "id": "2",
            "label": "Impact bekend"
        },
        "impact": {
            "value": 2
        },
        "expectedDuration": {
            "description": "Dit duurt tenminste tot zaterdag 13 februari 01:30 uur.",
            "endTime": "2021-02-13T01:30:00+0100"
        },
        "summaryAdditionalTravelTime": {
            "label": "De extra reistijd is meer dan 60 minuten.",
            "shortLabel": "Extra reistijd meer dan 60 min.",
            "minimumDurationInMinutes": 60
        },
        "publicationSections": [
            {
                "section": {
                    "stations": [
                        {
                            "uicCode": "8400319",
                            "stationCode": "HT",
                            "name": "'s-Hertogenbosch",
                            "coordinate": {
                                "lat": 51.69048,
                                "lng": 5.29362
                            },
                            "countryCode": "NL"
                        },
                        {
                            "uicCode": "8400667",
                            "stationCode": "VG",
                            "name": "Vught",
                            "coordinate": {
                                "lat": 51.6555557250977,
                                "lng": 5.29194450378418
                            },
                            "countryCode": "NL"
                        },
                        {
                            "uicCode": "8400129",
                            "stationCode": "BTL",
                            "name": "Boxtel",
                            "coordinate": {
                                "lat": 51.58433,
                                "lng": 5.31912
                            },
                            "countryCode": "NL"
                        },
                        {
                            "uicCode": "8400112",
                            "stationCode": "BET",
                            "name": "Best",
                            "coordinate": {
                                "lat": 51.5099983215332,
                                "lng": 5.38916683197022
                            },
                            "countryCode": "NL"
                        },
                        {
                            "uicCode": "8400196",
                            "stationCode": "EHS",
                            "name": "Eindhoven Strijp-S",
                            "coordinate": {
                                "lat": 51.4511108398438,
                                "lng": 5.45583343505859
                            },
                            "countryCode": "NL"
                        },
                        {
                            "uicCode": "8400206",
                            "stationCode": "EHV",
                            "name": "Eindhoven Centraal",
                            "coordinate": {
                                "lat": 51.4433326721191,
                                "lng": 5.48138904571533
                            },
                            "countryCode": "NL"
                        }
                    ],
                    "direction": "BOTH"
                },
                "consequence": {
                    "section": {
                        "stations": [
                            {
                                "uicCode": "8400319",
                                "stationCode": "HT",
                                "name": "'s-Hertogenbosch",
                                "coordinate": {
                                    "lat": 51.69048,
                                    "lng": 5.29362
                                },
                                "countryCode": "NL"
                            },
                            {
                                "uicCode": "8400667",
                                "stationCode": "VG",
                                "name": "Vught",
                                "coordinate": {
                                    "lat": 51.6555557250977,
                                    "lng": 5.29194450378418
                                },
                                "countryCode": "NL"
                            },
                            {
                                "uicCode": "8400129",
                                "stationCode": "BTL",
                                "name": "Boxtel",
                                "coordinate": {
                                    "lat": 51.58433,
                                    "lng": 5.31912
                                },
                                "countryCode": "NL"
                            }
                        ],
                        "direction": "ONE_WAY"
                    },
                    "description": "minder treinen",
                    "level": "LESS_TRAINS"
                }
            }
        ],
        "timespans": [
            {
                "start": "2021-02-12T02:25:00+0100",
                "end": "2021-02-12T10:35:23+0100",
                "situation": {
                    "label": "Tussen 's-Hertogenbosch en Boxtel rijden er minder treinen door een defect spoor."
                },
                "cause": {
                    "label": "Defect spoor"
                },
                "additionalTravelTime": {
                    "label": "De extra reistijd is meer dan 60 minuten.",
                    "shortLabel": "Extra reistijd meer dan 60 min.",
                    "minimumDurationInMinutes": 60
                },
                "advices": []
            }
        ]
    },`;
		const dis = parseJson(json) as Disruption;
		console.log(dis);
		component.disruption = dis;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
