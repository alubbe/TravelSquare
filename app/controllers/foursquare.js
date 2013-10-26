/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore');

exports.getMiddleOfLongLat = function(coordArray) {
	
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

console.log('Calculate middle');
console.log(exports.getMiddleOfLongLat([[5, 100], [5, 5]]));  
console.log('finished');

exports.getFromFoursquare = function(req, res) {
	
	//sinnvoller Code goes here
	
	res.render('foursquare/test');
};

exports.getBerlin = function(req, res) {
	var location = req.params.location;
	//query API

	var http = require('https');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
		host: 'https://api.foursquare.com',
		path: '/v2/venues/search?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20&near='
	};
	options.path += location;

	callback = function(response) {
		var data = '';

		response.on('data', function(chunk) {
			data += chunk; //append data
		});

		response.on('end', function() {
			console.log('finished receiving data');
		});
	};


http.request(options, callback).end();
res.render('foursquare/berlin', {
		location: location
	});
};


