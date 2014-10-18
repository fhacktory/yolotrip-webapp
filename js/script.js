
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

/* DRAWING ON THE MAP *****************/
function drawMarker(position, backpacker) {
	console.log(backpacker.attributes.username);
	var marker = new google.maps.Marker({
	    position: position,
	    map: map,
	    title: backpacker.attributes.username
	   });
	marker.setMap(map);
}


/* PARSE ******************************/
var User = Parse.Object.extend("User");
var query = new Parse.Query(User);
query.equalTo("username", "Chupee");
query.first({
  success: function(result) {
  	drawMarker(focus, result);
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});





