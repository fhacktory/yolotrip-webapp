/* DRAWING ON THE MAP *****************/
function drawMarker(map, position) {
	var marker = new google.maps.Marker({
	    position: position,
	    map: map,
	   });
	marker.setMap(map);
}

function setRelation() {

	var User = Parse.Object.extend("User");
	var Roadtrip = Parse.Object.extend("Roadtrip");
	var Location = Parse.Object.extend("Location");
	var Photo = Parse.Object.extend("Photo");

	query = new Parse.Query(User);
	query.find({
	  success: function(results) {
	  	console.log(results);
	    query2 = new Parse.Query(Roadtrip);

	  	for (var i = 0; i < results.length; i++) { 
	      query2.first({
			  success: function(result2) {
			  	console.log(result2);
			  	query2 = new Parse.Query(Photo);
				result2.relation("user").add(results[0]);
				result2.save();
			  },
			  error: function(error) {
			    console.log("Error: " + error.code + " " + error.message);
			  }
			});
	    }
	  	
	  },
	  error: function(error) {
	    console.log("Error: " + error.code + " " + error.message);
	  }
	});

}