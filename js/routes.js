var AppRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "test/:id": "test"
    }
});

// Initiate the router
var app_router = new AppRouter;
var markerArray = [];

// index.html
app_router.on('route:index', function(actions) {
    console.log('index');

	/* GOOGLE APIS ************************/
	var map = null;
	var focus = { lat: -34.397, lng: 150.644};
	var mapOptions = {
	  center: focus,
	  zoom: 8
	};

	function initialize() {
	    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	/* PARSE ******************************/
	setRelation();

	var User = Parse.Object.extend("User");
	var Roadtrip = Parse.Object.extend("Roadtrip");
	var Location = Parse.Object.extend("Location");
	var Photo = Parse.Object.extend("Photo");

	var query = null;

	var roadtrip, location, photo = null;

	query = new Parse.Query(Roadtrip);
	query.find().then(function(roadtrips){
		roadtrip = roadtrips[0];
		console.log(roadtrip);
		query = new Parse.Query(Location);
		query.equalTo("roadtrip", roadtrip);
		return query.find();
	}).then(function(locations){
        var lastLocationIndex = locations.length - 1;

        var origin, destination = null;
        var count = 1;
        $.each(locations, function(index, location) {
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
            directionsDisplay.setMap(map);

            //var marker = drawMarker(map, { lat: location.get("coordinates").latitude, lng:  location.get("coordinates").longitude } );
            if (location.get("visible")) {
                origin = destination;

                var point = new google.maps.LatLng(
                    location.get("coordinates").latitude,
                    location.get("coordinates").longitude
                );

                destination = point;

                var marker = drawMarker(
                    map,
                    { lat: location.get("coordinates").latitude, lng:  location.get("coordinates").longitude },
                    count
                );
                count++;
                if (index == lastLocationIndex) {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }

                if (null != origin) {

                    var request = {
                        origin:origin,
                        destination:destination,
                        travelMode: google.maps.TravelMode.DRIVING
                    };

                    directionsService.route(request, function(result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(result);
                        }
                    });
                }
            }
        });

	}, function(error) {
		console.log("Error: " + error.code + " " + error.message);
	});
});

// index.html#/test/1
app_router.on('route:test', function(id) {
    console.log(id);
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();