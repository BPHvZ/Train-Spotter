var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"kaart","component":"TrainMapComponent","data":{"reuse":true}},{"path":"stations","component":"AllStationsComponent","data":{"reuse":true}},{"path":"rit/:rideId","component":"RideInformationComponent","resolve":{"rideInformation":"RideInformationResolver"},"runGuardsAndResolvers":"paramsOrQueryParamsChange","data":{"reuse":false}},{"path":"materiaal/:trainset","component":"TrainsetInformationComponent","resolve":{"rideInformation":"TrainsetInformationResolver"},"runGuardsAndResolvers":"paramsOrQueryParamsChange","data":{"reuse":false}},{"path":"over","component":"AboutComponent","data":{"reuse":false}},{"path":"","redirectTo":"/kaart","pathMatch":"full"},{"path":"**","component":"PageNotFoundComponent","data":{"reuse":false}}],"kind":"module"}]}