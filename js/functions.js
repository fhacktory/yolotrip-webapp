/* DRAWING ON THE MAP *****************/
function drawMarker(map, position, backpacker) {
	console.log(backpacker.attributes.username);
	var marker = new google.maps.Marker({
	    position: position,
	    map: map,
	    title: backpacker.attributes.username
	   });
	marker.setMap(map);
}