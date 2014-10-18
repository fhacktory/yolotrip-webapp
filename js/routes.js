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
	var focus = { lat: -30.397, lng: 150.644};
	var mapOptions = {
	  center: focus,
	  zoom: 4
	};
	function initialize() {
	        map = new google.maps.Map(document.getElementById('map-canvas'),
	            mapOptions);
	      }
	

	/* PARSE ******************************/
	setRelation();

	var User = Parse.Object.extend("User");
	var Roadtrip = Parse.Object.extend("Roadtrip");
	var Location = Parse.Object.extend("Location");
	var Photo = Parse.Object.extend("Photo");

	var query = null;

	var roadtrip, location, photo, marker = null;

	// roadtrip
	query = new Parse.Query(Roadtrip);
	query.find().then(function(roadtrips){
		roadtrip = roadtrips[0];
		$("h1#roadtripName").html(roadtrip.get("title"));
		// locations
		query = new Parse.Query(Location);
		query.equalTo("roadtrip", roadtrip);
		return query.find();
	}).then(function(locations){
		$.each(locations, function(index, location) {
			console.log(location);
		    var marker = drawMarker(map, { lat: location.get("coordinates").latitude, lng:  location.get("coordinates").longitude } );
			console.log("marker before photo");
			console.log(marker);
			query = new Parse.Query(Photo);
			query.equalTo("location", location);

			query.find().then(function(photos) {
				for (var i = 0; i < photos.length; i++) { 
				  	if (photos[i] != undefined) {
				  		console.log("PHOTO NOT NULL");
				  		console.log(marker);
  						photoUrl = photos[i].get("file").url();
					      var contentString = '<img src="'+photoUrl+'" width="300"/>';
						  var infowindow = new google.maps.InfoWindow({
						      content: contentString
						  });
						  
						  google.maps.event.addListener(marker, 'click', function() {
					    	  infowindow.open(map,marker);
						  });
					}
				}
			})



		}); 
	}, function(error) {
		console.log("Error: " + error.code + " " + error.message);
	});

	google.maps.event.addDomListener(window, 'load', initialize);



});

// index.html#/test/1
app_router.on('route:test', function(id) {
    console.log(id);
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();