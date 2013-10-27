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

getMiddleOfLatLongMatrix = function(coordArray) {
	//sums
	var sumLat = 0;
	var sumLong = 0;

	//iterate through all coordinates
	var coordCount = 0;
	for (var i = 0; i < coordArray.length; i++) {
		for (var j = 0; j < coordArray[i].length; j++){
		sumLat += coordArray[i][j].lat;
		sumLong += coordArray[i][j].lng;
		coordCount++;
		}
	}

	sumLat /= coordCount;
	sumLong /= coordCount;

	var minRadius = 0;

	//go through all coordinates and find maximum distance to center
	// for calculating the MINIMUM RADIUS TO INHERIT ALL COORDINATES

	for (i = 0; i < coordArray.length; i++) {
		for (var j = 0; j < coordArray[i].length; j++){
			var tmpRadius = distanceBetween(sumLat, sumLong, coordArray[i][j].lat, coordArray[i][j].lng);
			if(tmpRadius > minRadius)// radius is bigger hence choose it
				minRadius = tmpRadius;
		}
	}

	var result = {
		center: {
			lat: sumLat,
			lng: sumLong
		},
		radius: minRadius * 1000
	};

	return result;

};

exports.getFromFoursquare = function(req, res) {
	
	//sinnvoller Code goes here
	
	res.render('foursquare/test');
};

addMorePlaces = function(tourstopsList, i, category, amount, callback) {
	//places array constains of items which have lat long and id
	//center has lat, long
	var https = require('https');
	var options = {
		host: 'api.foursquare.com',
		path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
	};
	//add center
	options.path += '&ll=' + tourstopsList.center.lat + ',' + tourstopsList.center.lng;
	//add radius in meters
	options.path += '&radius=' + Math.min(tourstopsList.radius, 100000);
	//add category
	options.path += '&query=' + category;

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
			var itemsLength = items.length;

			var result = [];
			for(var _i = 0; _i < itemsLength; _i++){
				var exists = false;
				for(var j = 0; j < tourstopsList.stops[i].length; j++) {
					if(items[_i].venue.id == tourstopsList.stops[i][j].id) {
						exists = true;
						break;
					}	
				}
				//is in list
				if(exists == false)
					result.push(items[_i]);
				//found enough unique results
				if(result.length >= amount)
					break;
			}
			tourstopsList.stops[i] = result.slice();
			callback(tourstopsList);
		});

		response.on("error", function(e){
			console.log(e);
		});
	};
	https.request(options, async).end();
};

getVenueDetails = function(arrayId, callback) {
	//arrayId contains a list of venue ids
	//callback will be called first argument containing all venue details
	//count of venues
	var venueCount = arrayId.length;

	//"gloabal" variable saving how many request venuaCallback got served
	var receiveCount = 0; //

	//array which sotres all options for the http requests
	var options = new Array();

	//get https
	var https = require('https');

	//create array for saving details
	venueDetails = new Array();

	//venueCallback
	venueCallback = function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk; //append data
		});

		response.on('end', function() {
			receiveCount++; // received venue details

			venueDetails.push(JSON.parse(data).response); // add received data to array

			if(receiveCount == venueCount) // all venue details received
				callback(venueDetails);
		});

		response.on("error", function(e){
			console.log(e);
		});
	};

	for(var i = 0; i<venueCount; i++) {
		var venueOption = {
			host: 'api.foursquare.com',
			path: '/v2/venues/'+ arrayId[i] + '?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
		};
		options.push(venueOption);
		//demand venue details
		https.request(options[i], venueCallback).end();
	}
};

exports.getVenuesCityCat = function(req, res) {
	//define variables
	var city = req.params.city;
	var category = req.params.category;
	var limit = req.params.limit;
	//initialise http
	var https = require('https');
	var options = {
		host: 'api.foursquare.com',
		path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
	};

	//set city by with near keyword
	options.path += '&near=' + city;

	//set category by section
	options.path += '&section=' + category;

	//set limit
	options.path += '&limit=' + limit;

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

			

			venueCount = parsed.response.groups[0].items.length // set venueCount;

			var ids = new Array();

			for(var i = 0; i<venueCount; i++) 
				//collect ids
				ids.push( parsed.response.groups[0].items[i].venue.id);

			//callback function to post results
			var postJason = function(toPost) {
				res.jsonp(toPost); // post all received data
			}

			//get venue details for id and call postJason with result
			getVenueDetails(ids, postJason);
		});

		response.on("error", function(e){
			console.log(e);
		});
	};

	https.request(options, callback).end();


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

	var places = [{
		
		id: '50d751d8e4b0b55bc64f3161'
	},
	{
		id: '51741e3c498ee3a44a7c0005'
	},
	{
		id: '51caec79498e8309e8177210'
	}
		];

	addMorePlaces(places, 'food', 6000, center, 2, callback);

	console.log(exports.getMiddleOfLatLongSimple([[40,6], [41,5], [45.768543, 4], [41.90876, 6.0987654], [41.023587,5], [45, 4], [41, 6], [41,5], [45, 4], [41, 6]]));

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

	tourstopsList.center = tourstopsList.hotel || getMiddleOfLatLongMatrix(tourstopsList.stops).center;
	tourstopsList.radius = getMiddleOfLatLongMatrix(tourstopsList.stops).radius;

	for(var _i = 0; _i < timesOfTheDay.length; _i++){
	// find out what slot will first be relevant
		if (timesOfTheDay[_i] >= tourstopsList.arrivalTime && tourstopsList.beginningSlot == null) tourstopsList.beginningSlot = _i;
	// find out which slot will be just too late for the itenary 
		if (timesOfTheDay[_i] > tourstopsList.departureTime && tourstopsList.endingSlot == null) tourstopsList.endingSlot = _i - 1;
	}
	if (tourstopsList.beginningSlot == null) tourstopsList.beginningSlot = timesOfTheDay.length;
	if (tourstopsList.endingSlot == null) tourstopsList.endingSlot = timesOfTheDay.length;

	// compute the total number of slots that will be available
	tourstopsList.totalSlots = tourstopsList.endingSlot - tourstopsList.beginningSlot + timesOfTheDay.length * (tourstopsList.numberOfCalendarDays - 1);
	//console.log(tourstopsList.beginningSlot);
	//console.log(tourstopsList.endingSlot);
	//console.log(tourstopsList.totalSlots);
	
	// add a centre to the tourstopsList and fill up the list if it wasn't full already
	var expectedSlots = [0,0,0,0,0,0,0], i, diff, queueLength = 0, numberOfReturns = 0;

	if (tourstopsList.numberOfCalendarDays <= 1){
		for(i = tourstopsList.beginningSlot; i < tourstopsList.endingSlot; i++){
			expectedSlots[i] = 1;

			diff = expectedSlots[i] - tourstopsList.stops[i].length;
			if(diff > 0){
				console.log("Difference of " + diff + " at i = " + i);
			}

		}
	}
	else {
		for(i = 0; i < timesOfTheDay.length; i++){
			if(i >= tourstopsList.beginningSlot) expectedSlots[i] += 1;
			if(i < tourstopsList.endingSlot) expectedSlots[i] += 1;
			expectedSlots[i] += tourstopsList.numberOfCalendarDays - 2;

			diff = expectedSlots[i] - tourstopsList.stops[i].length;
			if(diff > 0){
				console.log("Difference of " + diff + " at i = " + i);
				queueLength++;
				addMorePlaces(tourstopsList, i, "breakfast", diff, function(tourstopsList){
					numberOfReturns++;
					//console.log("peter");
					//console.log(numberOfReturns);
					//console.log(queueLength);
					if(queueLength <= numberOfReturns){
						console.log(tourstopsList.stops);
						console.log(tourstopsList.stops[7]);
						var done = iterativeShit(tourstopsList.stops, tourstopsList.center, tourstopsList.beginningSlot, null, 0, tourstopsList.totalSlots, {stops:[]}, {stops:[], sumOfSquares: 999999999});

						//get detailed information for all venues contained in done
						var ids = new Array();

						console.log(done);
						for(i = 0; i<done.stops.length; i++)
							ids.push(done.stops[0].venue.id); // add id

						var asyncCallback = function(response) {
							var stops = {
								stops: new Array()};
							stops.stops=response;
							res.jsonp(stops);
						};
						
						getVenueDetails(ids, asyncCallback);
					} 
				});
			};
		}
	}
	console.log("woohhaa" + queueLength);
	if(queueLength == 0)  res.jsonp(iterativeShit(tourstopsList.stops, tourstopsList.center, tourstopsList.beginningSlot, null, 0, tourstopsList.totalSlots, {stops:[]}, {stops:[], sumOfSquares: 999999999}));
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
		if(i % 7 == 0) tourstops.stops[n].timeframe = "Morning 1 - Food or Cafe";
		if(i % 7 == 1) tourstops.stops[n].timeframe = "Morning 2 - Arts or Sights";
		if(i % 7 == 2) tourstops.stops[n].timeframe = "Lunch - Food";
		if(i % 7 == 3) tourstops.stops[n].timeframe = "Afternoon 1 - Food or Cafe";
		if(i % 7 == 4) tourstops.stops[n].timeframe = "Afternoon 2 - Shopping or Outdoors";
		if(i % 7 == 5) tourstops.stops[n].timeframe = "Evening - Food";
		if(i % 7 == 6) tourstops.stops[n].timeframe = "Night - Nightlife";
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
		var lat1 = tourstops.stops[i].lat || tourstops.stops[i].venue.location.lat,
			lng1 = tourstops.stops[i].lng || tourstops.stops[i].venue.location.lng,
			lat2 = tourstops.stops[i+1].lat || tourstops.stops[i+1].venue.location.lat,
			lng2 = tourstops.stops[i+1].lng || tourstops.stops[i+1].venue.location.lng;

		// add the distance between the two stops
		tourstops.sumOfSquares += Math.pow(distanceBetween(lat1, lng1, lat2, lng2), 2);
		// if it is the start of travel or the first stop of the day, add the distance to the center (i.e. hotel) 
		if(i == 0 || tourstops.stops[i].asd == 1) tourstops.sumOfSquares += Math.pow(distanceBetween(lat1, lng1, center.lat, center.lng), 2);
		// if it is the the last stop of the day, add the distance to the center (i.e. hotel)
		if(tourstops.stops[i].i == 2) tourstops.sumOfSquares += Math.pow(distanceBetween(lat2, lng2, center.lat, center.lng), 2);
	}
	if (tourstops.sumOfSquares < optimizedTourstops.sumOfSquares){
		return tourstops;
	}
	else return null;
};
