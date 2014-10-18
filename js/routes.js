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

	var roadtrip, location, photo = null;

	// roadtrip
	query = new Parse.Query(Roadtrip);
	query.find().then(function(roadtrips){
		roadtrip = roadtrips[0];
		$("h1#roadtripName").html(roadtrip.get("title"));
		// locations
		query = new Parse.Query(Location);
		query.equalTo("roadtrip", roadtrip);
		query.include('photosArray');
		query.find({
			success: function(savedLocations) {
		    console.log('location length'+savedLocations.length);
		    for(var i=0; i<savedLocations.length; i++) {
		    	location = savedLocations[i];
		    	var photos = location.get('photosArray');
		    	var marker = drawMarker(map, { lat: location.get("coordinates").latitude, lng:  location.get("coordinates").longitude }, photos.length );
		    	var contentString = "";
		    	for (var j=0; j<photos.length; j++) {
		    		contentString += '<img src="'+photos[j].get('file').url()+'" width="300"/><br />';
		    	}
		    	  marker.contentString = contentString;
				  google.maps.event.addListener(marker, 'click', function() {
			          var infowindow = new google.maps.InfoWindow({
					      content: this.contentString
					  });
			    	  infowindow.open(map,this);
				  });
		    }
		  }
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

/*var query = new Parse.Query(Parse.Object.extend("Location"));
query.include('photosArray');
query.find({
	success: function(savedLocations) {
    console.log('location length'+savedLocations.length);
    for(var i=0; i<savedLocations.length; i++) {
    	var photos = savedLocations[i].get('photosArray');
    	for (var j=0; j<photos.length; j++) {
    		console.log(photos[j].get('fake'));
    	}
    }
  }
});*/