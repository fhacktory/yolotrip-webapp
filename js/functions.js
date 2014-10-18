/* DRAWING ON THE MAP *****************/
function drawMarker(map, position) {
	var marker = new google.maps.Marker({
	    position: position,
	    map: map,
	   });
	marker.setMap(map);
	return marker;
}

function setRelation() {

	var User = Parse.Object.extend("User");
	var Roadtrip = Parse.Object.extend("Roadtrip");
	var Location = Parse.Object.extend("Location");
	var Photo = Parse.Object.extend("Photo");
	var Message = Parse.Object.extend("Message");


	query = new Parse.Query(Location);
	query.find({
	  success: function(results) {
	  	console.log(results);
	    query2 = new Parse.Query(Message);

	  	for (var i = 0; i < results.length; i++) { 
	      query2.find({
			  success: function(results2) {
			  	console.log(i);
			  	console.log(results[i]);

			  	for (var i = 0; i < results2.length; i++) { 
			  		results2[i].relation("location").add(results[i]);
					results2[i].save();
			  	}
				
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