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


