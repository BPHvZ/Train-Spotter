import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DetailedTrainInformation } from "../../models/VirtualTrainAPI";

@Component({
	selector: "app-ride-information",
	templateUrl: "./ride-information.component.html",
	styleUrls: ["./ride-information.component.sass"],
})
export class RideInformationComponent implements OnInit {
	/**Detailed train information*/
	trainInformation: DetailedTrainInformation;

	private rideId: number = null;

	constructor(private route: ActivatedRoute) {
		this.trainInformation = {
			ritId: "3558",
			lat: 52.267487,
			lng: 4.6576533,
			snelheid: 139.0,
			richting: 221.33,
			horizontaleNauwkeurigheid: 272.22223,
			type: "IC",
			trainDetails: {
				bron: "DVS",
				ritnummer: 3558,
				station: "LEDN",
				type: "VIRM",
				vervoerder: "NS",
				spoor: "8b",
				materieeldelen: [
					{
						materieelnummer: 8608,
						type: "VIRMm1 VI",
						faciliteiten: ["WIFI", "TOILET", "STILTE", "FIETS", "STROOM"],
						afbeelding: "https://vt.ns-mlab.nl/v1/images/virmm1_6.png",
						bakken: [
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_6/virmm1_6_1.png",
									breedte: 1128,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_6/virmm1_6_2.png",
									breedte: 1104,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_6/virmm1_6_3.png",
									breedte: 1134,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_6/virmm1_6_4.png",
									breedte: 1136,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_6/virmm1_6_5.png",
									breedte: 1102,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_6/virmm1_6_6.png",
									breedte: 1130,
									hoogte: 300,
								},
							},
						],
					},
					{
						materieelnummer: 9405,
						type: "VIRMm1 IV",
						faciliteiten: ["WIFI", "TOILET", "STILTE", "FIETS", "STROOM"],
						afbeelding: "https://vt.ns-mlab.nl/v1/images/virmm1_4.png",
						bakken: [
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_4/virmm1_4_1.png",
									breedte: 1128,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_4/virmm1_4_2.png",
									breedte: 1134,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_4/virmm1_4_3.png",
									breedte: 1102,
									hoogte: 300,
								},
							},
							{
								afbeelding: {
									url: "https://vt.ns-mlab.nl/v1/images/virmm1_4/virmm1_4_4.png",
									breedte: 1130,
									hoogte: 300,
								},
							},
						],
					},
				],
				ingekort: false,
				lengte: 10,
				lengteInMeters: 270,
				lengteInPixels: 0,
			},
		};
	}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.rideId = Number(params["rideId"]);
			console.log("rideId: ", this.rideId);
		});
	}
}
