var AppRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "test/:id": "test"
    }
});

// Initiate the router
var app_router = new AppRouter;

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
	        map = new google.maps.Map(document.getElementById('map-canvas'),
	            mapOptions);
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
		$.each(locations, function(index, location) {
			console.log(location);
			console.log(location.get("coordinates").latitude);
		    drawMarker(map, { lat: location.get("coordinates").latitude, lng:  location.get("coordinates").longitude } );
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