/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),
	_ = require('underscore');

exports.getMiddleOfLatLong = function(coordArray) {
	
	//sums
	var sumX = 0;
	var sumY = 0;
	var sumZ = 0;
	console.log(coordArray);

	//iteratre throught all coordinates
	var coordCount = coordArray.length;
	for (var i = 0; i < coordCount; i++) {
		//Convert into cartesian coordinates

		//convert into radiants
		var radiantLat = coordArray[i][0] *Math.PI / 180;
		var radiantLong = coordArray[i][1] * Math.PI * 180;
		

		var x = Math.cos(radiantLat) * Math.cos(radiantLong);
		var y = Math.cos(radiantLat) * Math.sin(radiantLong);
		var z = Math.sin(radiantLat);
		
		console.log(y);

		sumX += x;
		sumY += y;
		sumZ += z;
	}

	sumX /= coordCount;
	sumY /= coordCount;
	sumZ /= coordCount;

	

	var resultLon = Math.atan2(sumY, sumX);
		var resultHyp = Math.sqrt(sumX * sumX + sumY * sumY);
		var resultLat = Math.atan2(sumZ, resultHyp);

		resultLon *= 180 / Math.PI;
		resultLat *= 180 /Math.PI;

		return [resultLat,resultLon];

};

exports.distanceBetween = function(lat1, lng1, lat2, lng2){
	lat1 = lat1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
	var R = 6371, //km
		dLat = (lat2-lat1) * Math.PI / 180,
		dLon = (lng2-lng1) * Math.PI / 180,
		a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	 
	return R * c;
};

exports.getMiddleOfLatLongSimple = function(coordArray) {
	
	//sums
	var sumLat = 0;
	var sumLong = 0;

	console.log(coordArray);


	//iteratre throught all coordinates
	var coordCount = coordArray.length;
	for (var i = 0; i < coordCount; i++) {

		sumLat += coordArray[i][0];
		sumLong += coordArray[i][1];
	}

	sumLat /= coordCount;
	sumLong /= coordCount;

	var minRadius = 0;

	//go through all coordinates and find maximum distance to center
	// for calculating the MINIMUM RADIUS TO INHERIT ALL COORDINATES

	for (i = 0; i < coordCount; i++) {
		var tmpRadius = exports.distanceBetween(sumLat, sumLong, coordArray[i][0], coordArray[i][1]);
		if(tmpRadius > minRadius)// radius is bigger hence choose it
			minRadius = tmpRadius;
	}

	var result = {
		center: {
			lat: sumLat,
			lng: sumLong
		},
		radius: minRadius
	};

		return result;

};

//console.log('Calculate middle');
//console.log(exports.getMiddleOfLatLongSimple([[40, 5], [45, 3]]));  
//console.log('finished');

exports.getFromFoursquare = function(req, res) {
	
	//sinnvoller Code goes here
	
	res.render('foursquare/test');
};

addMorePLaces = function(placesArray, category, radius, center, amount, callback) {
	//places array constains of items which have lat long and id
	//center has lat, long
	var https = require('https');
	var options = {
		host: 'api.foursquare.com',
		path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
	};
	//add center
	options.path += '&ll=' + center.lat + ',' + center.lon;
	//add radius in meters
	options.path += '&radius' + radius;
	//add category
	options.path += '&query' + category;

	async = function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk; //append data
		});

		response.on('end', function() {
			//parse json
			var parsed = JSON.parse(data);
			console.log(parsed);
			//iterate through all results
			var items = parsed.response.groups[0].items;
			var itemsLentgh = items.length;
			var placesArrayLength = placesArray.length;

			var result = new Array();
			for(var i = 0; i<itemsLentgh; i++){
				var exists = false;
				for(var j = 0; j < placesArrayLength; j++) {
					if(items[i].venue.id == placesArray[j].id) {
						exists = true;
						break;
					}	
				}
				//is in list
				if(exists == false)
					result.push(items[i]);
				//found enough unique results
				if(result.length >= amount)
					break;
			}

			callback(result);
		});

		response.on("error", function(e){
			console.log(e);
		});
	};
	https.request(options, async).end();
};

exports.getVenuesCityCat = function(req, res) {
	//define variables
	var city = req.params.city;
	var category = req.params.category;
	//initialise http
	var http = require('https');
	var options = {
		host: 'api.foursquare.com',
		path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
	};

	//set city by with near keyword
	options.path += '&near=' + city;

	//set category by section
	options.path += '&section=' + category;

	console.log(city)
	console.log(category);
	//create callback
	callback = function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk; //append data
		});

		response.on('end', function() {
			//parse json
			var parsed = JSON.parse(data);
			res.jsonp(parsed.response.groups[0].items);
			return parsed.response.venues;
		});

		response.on("error", function(e){
			console.log(e);
		});
	};

	http.request(options, callback).end();


};



isMorningActivity = function(id) {
	if(id == "4bf58dd8d48988d1bc941735") //cupcake - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1d0941735") //dessert - only afternoon
		return false;
	if(id == "4bf58dd8d48988d148941735") //donuts - only afternoon
		return false;
	if(id == "512e7cae91d4cbb4e5efe0af") //frozen yoghurt - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1c9941735") //ice cream - only afternoon
		return false;
	if(id == "4bf58dd8d48988d112941735") //juice bar - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1dc931735") //tea room - only afternoon
		return false;
	if(id == "4bf58dd8d48988d155941735") //gastrobup - only evening
		return false;
	if(id == "4e0e22f5a56208c4ea9a85a0") //distilery - only evening
		return false;
	if(id == "4bf58dd8d48988d14b941735") //winery - only evening
		return false;
	if(id == "4bf58dd8d48988d179941735") //bagelshop - only noon
		return false;
	if(id == "4bf58dd8d48988d128941735") //cafeteria - only noon
		return false;


	return true;
};

isNoonActivity = function(id) {
	if(id == "4bf58dd8d48988d16a941735") //bakery - only morning
		return false;
	if(id == "4bf58dd8d48988d143941735") //breakfast - only morning
		return false;
	if(id == "4bf58dd8d48988d1bc941735") //cupcake - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1d0941735") //dessert - only afternoon
		return false;
	if(id == "4bf58dd8d48988d148941735") //donuts - only afternoon
		return false;
	if(id == "512e7cae91d4cbb4e5efe0af") //frozen yoghurt - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1c9941735") //ice cream - only afternoon
		return false;
	if(id == "4bf58dd8d48988d112941735") //juice bar - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1dc931735") //tea room - only afternoon
		return false;
	if(id == "4bf58dd8d48988d155941735") //gastrobup - only evening
		return false;
	if(id == "4e0e22f5a56208c4ea9a85a0") //distilery - only evening
		return false;
	if(id == "4bf58dd8d48988d14b941735") //winery - only evening
		return false;
};

isAfternoonActivity = function(id) {
	if(id == "4bf58dd8d48988d16a941735") //bakery - only morning
		return false;
	if(id == "4bf58dd8d48988d143941735") //breakfast - only morning
		return false;
	if(id == "4bf58dd8d48988d155941735") //gastrobup - only evening
		return false;
	if(id == "4e0e22f5a56208c4ea9a85a0") //distilery - only evening
		return false;
	if(id == "4bf58dd8d48988d14b941735") //winery - only evening
		return false;
	if(id == "4bf58dd8d48988d179941735") //bagelshop - only noon
		return false;
	if(id == "4bf58dd8d48988d128941735") //cafeteria - only noon
		return false;
};

isEveningActivity = function(id) {
	if(id == "4bf58dd8d48988d16a941735") //bakery - only morning
		return false;
	if(id == "4bf58dd8d48988d143941735") //breakfast - only morning
		return false;
	if(id == "4bf58dd8d48988d1bc941735") //cupcake - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1d0941735") //dessert - only afternoon
		return false;
	if(id == "4bf58dd8d48988d148941735") //donuts - only afternoon
		return false;
	if(id == "512e7cae91d4cbb4e5efe0af") //frozen yoghurt - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1c9941735") //ice cream - only afternoon
		return false;
	if(id == "4bf58dd8d48988d112941735") //juice bar - only afternoon
		return false;
	if(id == "4bf58dd8d48988d1dc931735") //tea room - only afternoon
		return false;
	if(id == "4bf58dd8d48988d179941735") //bagelshop - only noon
		return false;
	if(id == "4bf58dd8d48988d128941735") //cafeteria - only noon
		return false;
};

exports.getBerlin = function(req, res) {
	var location = req.params.location;
	//query API

	var callback = function(json) {
		res.jsonp(json);
	};

	var center = {
		lat: 52,
		lon: 7
	};

	addMorePLaces([0], 'food', 800, center, 2, callback);
};

exports.buildItenary = function(req, res) {
var tourstops = {},
	timesOfTheDay = [9,13,15,19,21],
	tourstopsList = req.params.tourstops || {
		arrivalTime: 7,
		numberOfCalendarDays: 1,
		departureTime: 22,
		hotel: {
			lat: 44.07,
			lng: 18.12
		},
		stops: [
			{
				lat: 44,
				lng: 18,
				fixedTime: false
			},
			{
				lat: 44.1,
				lng: 18.1,
				fixedTime: false
			}
		]
	};

	// add a centre to the tourstopsList and fill up the list if it wasn't full already
	tourstopsListComplete = complete(tourstopsList);

	var slotMatrix = [[
			{
				lat: 44.1,
				lng: 18.1,
				fixedTime: false
			},
			{
				lat: 44.2,
				lng: 17.9,
				fixedTime: false
			}
		], [
		{
				lat: 44.04,
				lng: 18.01,
				fixedTime: false
			},
			{
				lat: 44.09,
				lng: 18.12,
				fixedTime: false
			}
		], [
		{
				lat: 44.2,
				lng: 18.12,
				fixedTime: false
			},
			{
				lat: 44.22,
				lng: 18.09,
				fixedTime: false
			}
		], [
		{
				lat: 44.25,
				lng: 18.03,
				fixedTime: false
			},
			{
				lat: 44.06,
				lng: 18.12,
				fixedTime: false
			}
		], [
		{
				lat: 44.22,
				lng: 18.01,
				fixedTime: false
			},
			{
				lat: 44.17,
				lng: 18.19,
				fixedTime: false
			}
		]];

	var beginningSlot, endingSlot;
	for(var _i = 0; _i < timesOfTheDay.length; _i++){
	// find out what slot will first be relevant
		if (timesOfTheDay[_i] >= tourstopsList.arrivalTime && beginningSlot == null) beginningSlot = _i;
	// find out which slot will be just too late for the itenary 
		if (timesOfTheDay[_i] > tourstopsList.departureTime && endingSlot == null) endingSlot = _i-1;
	}
	if (beginningSlot == null) beginningSlot = 5;
	if (endingSlot == null) endingSlot = 5;

	// compute the total number of slots that will be available
	var totalSlots = endingSlot - beginningSlot + 5 * (tourstopsList.numberOfCalendarDays - 1);
	//console.log(beginningSlot);
	//console.log(endingSlot);
	//console.log(totalSlots);
	
	tourstops = iterativeShit(slotMatrix, beginningSlot, null, 0, totalSlots, {stops:[]}, {stops:[], sumOfSquares: 999999999});
	
	res.jsonp(tourstops);
};

complete = function(tourstopsList){
tourstopsList.centre = tourstopsList.hotel || findSmallestContainingCircle(tourstopsList.stops).center;

// TODO: complete list around the center and radius

return tourstopsList;
};
 
findSmallestContainingCircle = function(arrayOfLatLng){
	// TODO: put the algorithm here
	var request = http.request(options, callback);
	
	return {center: {lat: 44.05, lng: 18.05}, radius: 5};
};

// i denotes the current slot, j the how manyth stop is being considered within that slot and n how often deep the function is within itself
iterativeShit = function(matrix, i, j, n, totalSlots, tourstops, optimizedTourstops){
	//the JS way of copying arrays :)
	var _matrix = [];
	for(var _i = 0; _i < matrix.length; _i++) _matrix[_i] = matrix[_i].slice(); 
	//console.log("i = " + i + " & j = " + j + " & n = " + n + " & totalSlots = " + totalSlots);

	//do this if it's the first time this functions gets launched
	if(j == null) {
		for(var _k = 0; _k < matrix[i%5].length; _k++){
			//console.log("need more!");
			var result = iterativeShit(matrix, i, _k, n, totalSlots, tourstops, optimizedTourstops);
			if (result !== null) {
				optimizedTourstops.sumOfSquares = result.sumOfSquares;
				optimizedTourstops.stops = result.stops.slice();
			}
		}
	}
	else {
		tourstops.stops[n] = matrix[i%5][j];
		// remove matrix[i][j]
		_matrix[i%5].splice(j, 1);
		if (n >= totalSlots - 1) {
			//console.log(tourstops);
			//check if this configuration is better than the old one
			return checkConfiguration(tourstops, optimizedTourstops);
		}
		else {
			for(var _j = 0; _j < matrix[(i+1)%5].length; _j++){
				//console.log("need more!");
				var _result = iterativeShit(matrix, i+1, _j, n+1, totalSlots, tourstops, optimizedTourstops);
				if (_result !== null) {
					optimizedTourstops.sumOfSquares = _result.sumOfSquares;
					optimizedTourstops.stops = _result.stops.slice();
				}
			}
		}

	}
	return optimizedTourstops;
};

checkConfiguration = function(tourstops, optimizedTourstops){
	tourstops.sumOfSquares = 0;
	for (var i = 0; i < tourstops.stops.length - 1; i++){
		tourstops.sumOfSquares += Math.pow(distanceBetween(tourstops.stops[i].lat, tourstops.stops[i].lng, tourstops.stops[i+1].lat, tourstops.stops[i+1].lng), 2);
	}
	if (tourstops.sumOfSquares < optimizedTourstops.sumOfSquares){
		return tourstops;
	}
	else return null;
};
