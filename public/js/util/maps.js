function GoogleMapsWrapper() {
	this.map = null;
	this.markers = [];
	this.directionsDisplay = null;
	this.directionsService = new google.maps.DirectionsService()
	this.bounds = null;

	this.initializeMap = function(canvasId) {
		// Create map
		this.map = new google.maps.Map(document.getElementById(canvasId), {
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
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
		this.markers = [];

		// Check if new places are given
		if (places.length == 0) {
			return;
		}

		// Create all markers
		this.bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < places.length; i++) {
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

		// Don't zoom in too far with only one marker
		if (this.bounds.getNorthEast().equals(this.bounds.getSouthWest())) {
			var extendPoint1 = new google.maps.LatLng(this.bounds.getNorthEast().lat() + 0.01, this.bounds.getNorthEast().lng() + 0.01);
			var extendPoint2 = new google.maps.LatLng(this.bounds.getNorthEast().lat() - 0.01, this.bounds.getNorthEast().lng() - 0.01);
			this.bounds.extend(extendPoint1);
			this.bounds.extend(extendPoint2);
		}

		// Fit the map to display all markers
		this.map.fitBounds(this.bounds);

		if (this.markers.length == 1) {
			// Can't calculate route with only one marker
			return;
		}

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
