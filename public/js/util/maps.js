function GoogleMapsWrapper() {
	this.map = null;
	this.markers = [];
	this.directionsDisplay = null;
	this.directionsService = new google.maps.DirectionsService()
	this.bounds = null;

	this.initializeMap = function() {
		// Create map
		this.map = new google.maps.Map(document.getElementById("tour-map-canvas"), {
			zoom: 4,
			center: new google.maps.LatLng(45, 0),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		// Set directions renderer
		this.directionsDisplay = new google.maps.DirectionsRenderer();
		this.directionsDisplay.setMap(this.map);
		this.directionsDisplay.setOptions({
			suppressMarkers: true
		});
	};

	this.updateRoute = function(places) {
		// Remove old markers
		for (var i in this.markers) {
			this.markers[i].setMap(null);
		}
		this.markers = [];

		// Create all markers
		this.bounds = new google.maps.LatLngBounds();
		for (var i in places) {
			var color = (i == 0) ? '' : '_green';
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(places[i].lat, places[i].lng),
				title: 'Stop-'+i,
				icon: 'http://maps.google.com/mapfiles/marker'+color+String.fromCharCode(65 + parseInt(i))+'.png'
			});
			// Update bounds and add marker to map
			this.bounds.extend(marker.getPosition());
			marker.setMap(this.map);
			this.markers.push(marker);
		}

		// Fit the map to display all markers
		this.map.fitBounds(this.bounds);

		// Create waypoints
		var waypoints = [];
		for (var i = 1; i < this.markers.length; i++) {
			waypoints.push({
				location: this.markers[i].getPosition(),
				stopover: false
			});
		}

		// Get directions
		var me = this;
		this.directionsService.route({
			origin: this.markers[0].getPosition(),
			waypoints: waypoints,
			destination: this.markers[0].getPosition(),
			travelMode: google.maps.DirectionsTravelMode.WALKING
		}, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				me.directionsDisplay.setDirections(response);
			}
		});
	};
}

// var points = [
// 	{
// 		lat: 40.728162904651136,
// 		lng: -73.98801601305168
// 	},{
// 		lat: 40.689644,
// 		lng: -73.971364
// 	},{
// 		lat: 40.697673182111075,
// 		lng: -73.99341344833374
// 	},{
// 		lat: 40.731673368956436,
// 		lng: -74.00453787112845
// 	}
// ];

// var wrapper = new GoogleMapsWrapper();
// function start() {
// 	wrapper.initializeMap();
// 	wrapper.updateRoute(points);
// }

// google.maps.event.addDomListener(window, 'load', start);


