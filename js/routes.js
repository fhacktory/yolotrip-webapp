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
var User = Parse.Object.extend("User");
var Roadtrip = Parse.Object.extend("Roadtrip");
var Location = Parse.Object.extend("Location");

var query = null;

query = new Parse.Query(User);
query.first({
  success: function(result) {
  	drawMarker(map, focus, result);
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});

query = new Parse.Query(Roadtrip);
var location = new Parse.Object("Location");
query.first({
  success: function(result) {
	location.put("roadtrip", result);
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});

});

// index.html#/test/1
app_router.on('route:test', function(id) {
    console.log(id);
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();