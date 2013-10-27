/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore');


exports.getFromFoursquare = function(req, res) {
	
	//sinnvoller Code goes here
	
	res.render('foursquare/test');
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

	return {center: {lat: 44.05, lng: 18.05}, radius: 5};
};

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
