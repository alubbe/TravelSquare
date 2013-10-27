/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	async = require('async'),
	_ = require('underscore');

distanceBetween = function(lat1, lng1, lat2, lng2){
	lat1 = lat1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
	var R = 6371, //km
		dLat = (lat2-lat1) * Math.PI / 180,
		dLon = (lng2-lng1) * Math.PI / 180,
		a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	 
	return R * c;
};

getMiddleOfLatLong = function(coordArray) {
	
	//sums
	var sumLat = 0;
	var sumLong = 0;

	//iterate through all coordinates
	var coordCount = coordArray.length;
	for (var i = 0; i < coordCount; i++) {

		sumLat += coordArray[i].lat;
		sumLong += coordArray[i].lng;
	}

	sumLat /= coordCount;
	sumLong /= coordCount;

	var minRadius = 0;

	//go through all coordinates and find maximum distance to center
	// for calculating the MINIMUM RADIUS TO INHERIT ALL COORDINATES

	for (i = 0; i < coordCount; i++) {
		var tmpRadius = distanceBetween(sumLat, sumLong, coordArray[i].lat, coordArray[i].lng);
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

getVenuesCityCat = function(city, category) {
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

	//create callback
	callback = function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk; //append data
		});

		response.on('end', function() {
			//parse json
			var parsed = JSON.parse(data);
			console.log(parsed.response.venues[0]);
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

	getVenuesCityCat('Berlin', 'food');

	var http = require('https');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
		host: 'api.foursquare.com',
		path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
	};
	options.path += location;

	console.log(options.path);

	callback = function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk; //append data
		});

		response.on('end', function() {
			res.render('foursquare/berlin', {
					location: location
				});

		});
	};


	var request = http.request(options, callback);

	request.on("error", function(e){
		console.log(e);
	});
	request.end();
};

exports.buildItenary = function(req, res) {
	var tourstops = {},
		timesOfTheDay = [9,11,13,15,17,19,21],
		tourstopsList = req.params.tourstops || {
			arrivalTime: 10,
			numberOfCalendarDays: 3,
			departureTime: 18,
			hotel: {
				lat: 44.07,
				lng: 18.12
			},
			stops: [[
					{
						lat: 44.1,
						lng: 18.1,
						id: "blub",
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
				], [
				{
						lat: 44.42,
						lng: 17.81,
						fixedTime: false
					},
					{
						lat: 44.27,
						lng: 17.99,
						fixedTime: false
					}
				], [
				{
						lat: 43.97,
						lng: 18.04,
						fixedTime: false
					},
					{
						lat: 43.91,
						lng: 18.09,
						fixedTime: false
					}
			]],

		};

	tourstopsList.center = tourstopsList.hotel || getMiddleOfLatLong(tourstopsList.stops).center;
	tourstopsList.radius = getMiddleOfLatLong(tourstopsList.stops).radius;

	var beginningSlot, endingSlot;
	for(var _i = 0; _i < timesOfTheDay.length; _i++){
	// find out what slot will first be relevant
		if (timesOfTheDay[_i] >= tourstopsList.arrivalTime && beginningSlot == null) beginningSlot = _i;
	// find out which slot will be just too late for the itenary 
		if (timesOfTheDay[_i] > tourstopsList.departureTime && endingSlot == null) endingSlot = _i - 1;
	}
	if (beginningSlot == null) beginningSlot = timesOfTheDay.length;
	if (endingSlot == null) endingSlot = timesOfTheDay.length;

	// compute the total number of slots that will be available
	var totalSlots = endingSlot - beginningSlot + timesOfTheDay.length * (tourstopsList.numberOfCalendarDays - 1);
	//console.log(beginningSlot);
	//console.log(endingSlot);
	//console.log(totalSlots);
	
	// add a centre to the tourstopsList and fill up the list if it wasn't full already
	var expectedSlots = [0,0,0,0,0,0,0], i, diff;

	if (tourstopsList.numberOfCalendarDays <= 1){
		for(i = beginningSlot; i < endingSlot; i++){
			expectedSlots[i] = 1;

			diff = expectedSlots[i] - tourstopsList.stops[i].length;
			if(diff > 0){
				console.log("Difference of " + diff + " at i = " + i);
			};

		}
	}
	else {
		for(i = 0; i < timesOfTheDay.length; i++){
			if(i >= beginningSlot) expectedSlots[i] += 1;
			if(i < endingSlot) expectedSlots[i] += 1;
			expectedSlots[i] += tourstopsList.numberOfCalendarDays - 2;

			diff = expectedSlots[i] - tourstopsList.stops[i].length;
			if(diff > 0){
				console.log("Difference of " + diff + " at i = " + i);
				//tourstopsList.stops[i].push(addMorePlaces(tourstopsList.stops[i], tourstopsList.center, tourstopsList.radius, diff, function(tourstops){
					//res.jsonp(iterativeShit(tourstops.stops, tourstops.center, beginningSlot, null, 0, totalSlots, {stops:[]}, {stops:[], sumOfSquares: 999999999}));
				//}));
			};
		}
	}


	tourstops = iterativeShit(tourstopsList.stops, tourstopsList.center, beginningSlot, null, 0, totalSlots, {stops:[]}, {stops:[], sumOfSquares: 999999999});
	
	res.jsonp(tourstops);
};

/*

Phase 0: Morning 1 - Food or Cafe
Phase 1: Morning 2 - Arts or Sights
Phase 2: Lunch - Food
Phase 3: Afternoon 1 - Food or Cafe
Phase 4: Afternoon 2 - Shopping or Outdoors
Phase 5: Evening - Food
Phase 6: Night - Nightlife

*/

complete = function(tourstopsList, beginningSlot, endingSlot, lenghtOfADay){
	var expectedSlots = [0,0,0,0,0,0,0], i, diff;

	if (tourstopsList.numberOfCalendarDays <= 1){
		for(i = beginningSlot; i < endingSlot; i++){
			expectedSlots[i] = 1;

			diff = expectedSlots[i] - tourstopsList.stops[i].length;
			if(diff > 0){
				console.log("Difference of " + diff + " at i = " + i);
			};

		}
	}
	else {
		for(i = 0; i < lenghtOfADay; i++){
			if(i >= beginningSlot) expectedSlots[i] += 1;
			if(i < endingSlot) expectedSlots[i] += 1;
			expectedSlots[i] += tourstopsList.numberOfCalendarDays - 2;

			diff = expectedSlots[i] - tourstopsList.stops[i].length;
			if(diff > 0){
				console.log("Difference of " + diff + " at i = " + i);
				//tourstopsList.stops[i].push(addMorePlaces(tourstopsList.stops[i], tourstopsList.center, tourstopsList.radius, diff, ));
			};
		}
	}

	//console.log(expectedSlots);

	return tourstopsList;
};
 
// i denotes the current slot, j the how manyth stop is being considered within that slot and n how often deep the function is within itself
iterativeShit = function(matrix, center, i, j, n, totalSlots, tourstops, optimizedTourstops){
	//the JS way of copying arrays :)
	var _matrix = [];
	for(var _i = 0; _i < matrix.length; _i++) _matrix[_i] = matrix[_i].slice(); 
	//console.log("i = " + i + " & j = " + j + " & n = " + n + " & totalSlots = " + totalSlots);

	//do this if it's the first time this functions gets launched
	if(j == null) {
		for(var _k = 0; _k < matrix[i%7].length; _k++){
			//console.log("need more!");
			var result = iterativeShit(matrix, center, i, _k, n, totalSlots, tourstops, optimizedTourstops);
			if (result !== null) {
				optimizedTourstops.sumOfSquares = result.sumOfSquares;
				optimizedTourstops.stops = result.stops.slice();
			}
		}
	}
	else {
		tourstops.stops[n] = matrix[i%7][j];
		tourstops.stops[n].asd = 0;
		if(i % 7 == 0) tourstops.stops[n].asd = 1; // if it is the first stop of the day
		if(i % 7 == 6) tourstops.stops[n].asd = 2; // if it is the last stop of the day
		// remove matrix[i][j]
		_matrix[i%7].splice(j, 1);
		if (n >= totalSlots - 1) {
			//console.log(tourstops);
			//check if this configuration is better than the old one
			return checkConfiguration(tourstops, center, optimizedTourstops);
		}
		else {
			for(var _j = 0; _j < matrix[(i+1)%7].length; _j++){
				//console.log("need more!");
				var _result = iterativeShit(matrix, center, i+1, _j, n+1, totalSlots, tourstops, optimizedTourstops);
				if (_result !== null) {
					optimizedTourstops.sumOfSquares = _result.sumOfSquares;
					optimizedTourstops.stops = _result.stops.slice();
				}
			}
		}

	}
	return optimizedTourstops;
};

checkConfiguration = function(tourstops, center, optimizedTourstops){
	tourstops.sumOfSquares = 0;
	
	for (var i = 0; i < tourstops.stops.length - 1; i++){
		// add the distance between the two stops
		tourstops.sumOfSquares += Math.pow(distanceBetween(tourstops.stops[i].lat, tourstops.stops[i].lng, tourstops.stops[i+1].lat, tourstops.stops[i+1].lng), 2);
		// if it is the start of travel or the first stop of the day, add the distance to the center (i.e. hotel) 
		if(i == 0 || tourstops.stops[i].asd == 1) tourstops.sumOfSquares += Math.pow(distanceBetween(tourstops.stops[i].lat, tourstops.stops[i].lng, center.lat, center.lng), 2);
		// if it is the the last stop of the day, add the distance to the center (i.e. hotel)
		if(tourstops.stops[i].i == 2) tourstops.sumOfSquares += Math.pow(distanceBetween(tourstops.stops[i+1].lat, tourstops.stops[i+1].lng, center.lat, center.lng), 2);
	}
	if (tourstops.sumOfSquares < optimizedTourstops.sumOfSquares){
		return tourstops;
	}
	else return null;
};
