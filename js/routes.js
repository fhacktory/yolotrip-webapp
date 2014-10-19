var AppRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "test/:id": "test",
        ":username/roadtrip/:roadtripname": "roadtrip"
    }
});

// Initiate the router
var app_router = new AppRouter;

// index.html
app_router.on('route:index', function(actions) {

});

app_router.on('route:roadtrip', function(userslug, roadtripslug) {
    console.log(userslug);
    console.log(roadtripslug);

	/* GOOGLE APIS ************************/
	var map = null;
	var focus = { lat: -30.397, lng: 150.644};
	var mapOptions = {
	  center: focus,
	  zoom: 4
	};
	var styles = [
	  {
	    "featureType": "administrative",
	    "elementType": "labels.text",
	    "stylers": [
	      { "gamma": 2.44 },
	      { "saturation": -30 },
	      { "lightness": -2 },
	      { "weight": 0.2 },
	      { "hue": "#00a1ff" },
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "administrative",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "simplified" },
	      { "invert_lightness": true }
	    ]
	  },{
	    "featureType": "water",
	    "elementType": "labels",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "administrative.locality",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "poi.park",
	    "stylers": [
	      { "visibility": "off" }
	    ]
	  },{
	    "featureType": "administrative.locality",
	    "stylers": [
	      { "visibility": "simplified" }
	    ]
	  },{
	    "featureType": "road.highway",
	    "stylers": [
	      { "visibility": "simplified" },
	      { "saturation": -100 }
	    ]
	  },{
	  }
	];
	function initialize() {
	        map = new google.maps.Map(document.getElementById('map-canvas'),
	            mapOptions);
	        map.setOptions({styles: styles});
	      }
	

	/* PARSE ******************************/

	var User = Parse.Object.extend("User");
	var Roadtrip = Parse.Object.extend("Roadtrip");
	var Location = Parse.Object.extend("Location");
	var Photo = Parse.Object.extend("Photo");

	var query = null;

	var roadtrip, location, photo = null;
	var  infowindow = new google.maps.InfoWindow();

	// user
	query = new Parse.Query(User);
	query.equalTo("slug", userslug);
	query.first().then(function(user) {
		if(user != undefined) {
			$("p#username").append("par "+user.get("username"));
			query = new Parse.Query(Roadtrip);
			query.equalTo("slug", roadtripslug);
			query.equalTo("user", user);
			return query.first();
		} else {
			return Parse.Promise.error("There is no such user");
		}
	}).then(function(roadtrip) {
		if(roadtrip != null) {
			$("h1#roadtripName").append(roadtrip.get("title"));

			// locations
			query = new Parse.Query(Location);
			query.equalTo("roadtrip", roadtrip);
			query.ascending("createdAt");
			query.include('photosArray');
			query.include('messages');
			query.find({
				success: function(savedLocations) {
                    var lastLocationIndex = savedLocations.length - 1;
                    var origin, destination = null;
                    var count = 1;

                    $.each(savedLocations, function(index, location) {
                        var directionsService = new google.maps.DirectionsService();
                        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
                        directionsDisplay.setMap(map);

                        origin = destination;

                        var point = new google.maps.LatLng(
                            location.get("coordinates").latitude,
                            location.get("coordinates").longitude
                        );

                        destination = point;

                        // photos
                        var photos = location.get('photosArray');
                        // messages
                        var messages = location.get('messages');

                        var marker = drawMarker(map, { lat: location.get("coordinates").latitude, lng:  location.get("coordinates").longitude }, photos.length);
                        count++;

                        if (index == lastLocationIndex) {
                            marker.setAnimation(google.maps.Animation.BOUNCE);
                        }

                        var contentString = "";
                        if(photos != undefined) {
                            for (var j=0; j<photos.length; j++) {
                                contentString += '<img src="'+photos[j].get('file').url()+'" width="300"  onclick="toggleFullScreen(this.src);" /><br />';
                            }
                        }
                        if(messages != undefined) {
                            for (var k=0; k<messages.length; k++) {
                                console.log(messages[k]);
                                contentString += '<hr /><p>'+messages[k].get('Message')+'</p>';
                            }
                        }
                        console.log(contentString);
                          marker.contentString = contentString;
                          google.maps.event.addListener(marker, 'click', function() {
                            infowindow.close();
                            infowindow = new google.maps.InfoWindow({
                                  content: this.contentString
                              });
                              infowindow.open(map,this);
                          });

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
                    });
			  }
			});
		} else {
			return Parse.Promise.error("There is no such roadtrip for this user");
		}

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

/*
var query = new Parse.Query(Parse.Object.extend("Location"));
query.include('messages');
query.find({
	success: function(savedLocations) {
    console.log('location length'+savedLocations.length);
    for(var i=0; i<savedLocations.length; i++) {
    	var photos = savedLocations[i].get('messages');
    	if (photos)
        	console.log(photos[0].get('Message'));
    }
  }
});
*/