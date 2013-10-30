/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  async = require('async'),
  _ = require('underscore'),
  http = require('http'),
  https = require('https');


exports.getVenuesCityCat = function(req, res) {
  //define variables
  var city = req.params.city;
  var category = req.params.category;
  var limit = req.params.limit;
  //initialise getJSON options
  var options = {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
  };
  //set add city, category and limit
  options.path += '&near=' + city;
  options.path += '&section=' + category;
  options.path += '&limit=' + limit;

  getJSON(options, function(statusCode, result){
    //collect the ids of all returned stores
    var ids = [];
    for(var i = 0; i < result.response.groups[0].items.length; i++)
      ids.push( result.response.groups[0].items[i].venue.id);

    //get further venue details for the collected ids and return them to the client
    getVenueDetails(ids, function(json_data) {
      res.jsonp(json_data); 
    });
  });
};

var getVenueDetails = function(arrayId, callback) {
  //arrayId contains a list of foursquare venue ids
  //callback will be called with the first argument containing all venue details
  var venueCount = arrayId.length, venueDetails = [];

  //"global" variable saving for how many IDs the details have been returned
  var receiveCount = 0; //

  for(var i = 0; i < venueCount; i++) {
    var venueOption = {
      host: 'api.foursquare.com',
      port: 443,
      path: '/v2/venues/'+ arrayId[i] + '?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
    };
    getJSON(venueOption, function(statusCode, result) {
      // increase received details count
      receiveCount++;

      // modify data to TravelSquare format and add it to array
      venueDetails.push(convertToTravelSquareFormat(result.response)); 

      // finish if all venue details have been received
      if(receiveCount == venueCount) 
        callback(venueDetails);
    });
  }
};

var convertToTravelSquareFormat = function(foursquare_item){
  var venue = {}, location = {}, photo = {};
  if (foursquare_item.venue == null){
    console.log("response.venue is null");
    console.log(foursquare_item);
  } else {
    venue = foursquare_item.venue;
    if (venue.location == null){
      console.log("venue.location is null");
      console.log(venue);
    } else {
      location = venue.location;
      if (venue.photos.groups == null){
        console.log("venue.photos.groups is null");
        console.log(venue.photos);
      } else {
        if (venue.photos.groups[0] == null){
          console.log("venue.photos.groups[0] is null");
          console.log(venue.photos);
        } else {
          if (venue.photos.groups[0].items == null){
            console.log("venue.photos.groups[0].items is null");
            console.log(venue.photos);
          } else {
            if (venue.photos.groups[0].items[0] == null){
              console.log("venue.photos.groups[0].items[0] is null");
              console.log(venue.photos);
            } else {
              photo = venue.photos.groups[0].items[0];
            }
          }
        }
      }
    }
  }

  // modify data to TravelSquare format and return it
  return {
    name: venue.name,
    location: {
      address:location.address + ", " + location.postalCode + "  " + location.city,
      lat:location.lat,
      lng:location.lng
    },
    category:venue.categories.name, 
    rating:venue.rating,
    likes:venue.likes.count,
    picture_url:photo.prefix + photo.width + "x" + photo.height + photo.suffix,
    fs_url:venue.canonicalUrl,
    fs_id:venue.id
  }; 
};

exports.buildItenary = function(req, res) {
  var requiredTourstops = req.params.itenaryRequest || mock_requiredTourstops;
  var tourstops = [], centerIDs = [], i, j;
  var priorities = ["sights", "arts", "outdoors", "dinner", "nightlife", "shopping", "lunch", "cafe", "breakfast"]; 

  for(i = 0; i < priorities.length && tourstops.length < requiredTourstops.numberOfCalendarDays; i++) {
    var priority = priorities[i];
    var venues = requiredTourstops[priority];
    // console.log("i = " + i + " & priority = " + priority + " & venues = " + venues);
    for(j = 0; j < venues.length && tourstops.length < requiredTourstops.numberOfCalendarDays; j++){
      var newEntry = [null, null, null, null, null, null, null];
      var new_centerID = categoryToIndex(priority);
      // console.log("the new centerID is " + new_centerID);
      centerIDs.push(new_centerID);
      newEntry[new_centerID] = venues[j];
      tourstops.push(newEntry);
    }
  }

  // if there are not enough centers, find more sights to fill the remaining days
  if (tourstops.length < requiredTourstops.numberOfCalendarDays) {
    console.log("Too few centers!");
  } 

  // if there were enough centers, distribute the remaining venues by proximity
  else {
    console.log("need to distribute the remaining venues");
    j++;
    for (i; i < priorities.length; i++) {
      var priority = priorities[i];
      var venues = requiredTourstops[priority];
      console.log("i = " + i + " & priority = " + priority + " & venues = " + venues);
      for(j; j < venues.length; j++){
        var venue = venues[j], min_distance = 999999999, day, timeslot;
        // iterate through each day and find the distance to the center
        for(var k = 0; k < tourstops.length; k++){
          // make sure there is still room in the day for this venue
          var venueIndex = categoryToIndex(priority, true);
          for(var l = 0; l < venueIndex.length; l++){
            // console.log("venueIndex[l] is " + venueIndex[l] + " & tourstops[k][venueIndex[l]] is " + tourstops[k][venueIndex[l]]);
            if(tourstops[k][venueIndex[l]] == null){
              var distance = distanceBetween(venue, tourstops[k][centerIDs[k]]);
              if(distance < min_distance) {
                min_distance = distance;
                day = k;
                timeslot = venueIndex[l];
              }
            }
          }
        }
        // finally, put the venue into its best day & timeslot
        // console.log("day is " + day + " and timeslot is " + timeslot);
        tourstops[day][timeslot] = venue;
      }
    j = 0;
    }
  }

  return res.jsonp(tourstops);

  var timesOfTheDay = [9,11,13,15,17,19,21],
    tourstopsList = req.params.itenaryRequest || mock_itenaryRequest;

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

  // add a centre to the tourstopsList and fill up the list if it wasn't full already
  var expectedSlots = [0,0,0,0,0,0,0], i, diff, queueLength = 0, numberOfReturns = 0;

  // do the following if the the user arrives and leaves on the same day
  if (tourstopsList.numberOfCalendarDays <= 1){
    for(i = tourstopsList.beginningSlot; i < tourstopsList.endingSlot; i++){
      expectedSlots[i] = 1;

      diff = expectedSlots[i] - tourstopsList.stops[i].length;
      if(diff > 0){
        console.log("Difference of " + diff + " at i = " + i);
      }
    }
  }
  // do the following if arrival and departure happen on two different days, with some amount of full days in between
  else {
    for(i = 0; i < timesOfTheDay.length; i++){
      if(i >= tourstopsList.beginningSlot) expectedSlots[i] += 1;
      if(i < tourstopsList.endingSlot) expectedSlots[i] += 1;
      expectedSlots[i] += tourstopsList.numberOfCalendarDays - 2;

      diff = expectedSlots[i] - tourstopsList.stops[i].length;
      if(diff > 0){
        console.log("Difference of " + diff + " at i = " + i);
        queueLength++;
        addMorePlaces(tourstopsList, i, category(i), diff, function(result_array, i){
          numberOfReturns++;
          //console.log("got additional results back!");
          //console.log(result_array);
          for(var j = 0; j < result_array.length; j++) tourstopsList.stops[i].push(result_array[j]);
          if(queueLength <= numberOfReturns){
            res.jsonp(iterativeShit(tourstopsList.stops, tourstopsList.center, tourstopsList.beginningSlot, null, 0, tourstopsList.totalSlots, {stops:[], beginningSlot: tourstopsList.beginningSlot, endingSlot: tourstopsList.endingSlot, numberOfCalendarDays: tourstopsList.numberOfCalendarDays, }, {stops:[], sumOfSquares: 999999999}));
          }
        });
      }
    }
  }
  console.log("Es muessen noch " + queueLength + " Kategorien aufgefuellt werden.");
  if(queueLength == 0) res.jsonp(iterativeShit(tourstopsList.stops, tourstopsList.center, tourstopsList.beginningSlot, null, 0, tourstopsList.totalSlots, {stops:[], beginningSlot: tourstopsList.beginningSlot, endingSlot: tourstopsList.endingSlot, numberOfCalendarDays: tourstopsList.numberOfCalendarDays, }, {stops:[], sumOfSquares: 999999999}));
};

var addMorePlaces = function(tourstopsList, i, category, amount, callback) {
  //places array constains of items which have lat long and id
  //center has lat, long
  var options = {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20'
  };
  //add center
  options.path += '&ll=' + tourstopsList.center.lat + ',' + tourstopsList.center.lng;
  //add radius in meters
  options.path += '&radius=' + tourstopsList.radius;
  //add category
  options.path += '&query=' + category;

  var internal_callback = function(statusCode, result) {
    // call out errors
    if(result == null) {
      console.log("got an empty result!");
      console.log(result);
    }

    // if a warning was returned, increase the radius and try again
    if(result.response.warning != null) {
      console.log("got a warning!");
      console.log(options);
      console.log(result);
      options.path = '/v2/venues/explore?client_id=WUH3Z4VTUYMQCD54KHR0O2BBXXSCIBIQ31I2NX2VGNL2T4AF&client_secret=S0LD0WYY11CYTJQZ01EYBBL0SGNSLUN0RXRXJOJMO0Y540WU&v=20130815%20%20%20';
      //add center
      options.path += '&ll=' + tourstopsList.center.lat + ',' + tourstopsList.center.lng;
      //add radius in meters
      options.path += '&radius=' + tourstopsList.radius * 2;
      //add category
      options.path += '&query=' + category;

      return getJSON(options, internal_callback);
    }

    //iterate through all results
    var items = result.response.groups[0].items;
    var itemsLength = items.length;
    var result_array = [];

    for(var _i = 0; _i < itemsLength; _i++){
      var item = convertToTravelSquareFormat(items[i]);
      var exists = false;
      for(var j = 0; j < tourstopsList.stops[i].length; j++) {
        if(item.fs_id == tourstopsList.stops[i][j].fs_id) {
          exists = true;
          break;
        }
      }
      //is in list
      if(exists === false)
        result_array.push(item);
      //found enough unique results
      if(result_array.length >= amount)
        break;
    }
    //tourstopsList.stops[i] = result_array.slice();
    callback(result_array, i);
  };
  getJSON(options, internal_callback);
};

// i denotes the current slot, j the how manyth stop is being considered within that slot and n how often deep the function is within itself
var iterativeShit = function(matrix, center, i, j, n, totalSlots, tourstops, optimizedTourstops){
  //the JS way of copying arrays :)
  var _matrix = [];
  for(var _i = 0; _i < matrix.length; _i++) _matrix[_i] = matrix[_i].slice();
  // console.log("i = " + i + " & j = " + j + " & n = " + n + " & totalSlots = " + totalSlots);

  //do this if it's the first time this functions gets launched
  if(j == null) {
    for(var _k = 0; _k < tourstops.numberOfCalendarDays; _k++) tourstops.stops[_k] = [];
    for(_k = 0; _k < matrix[i%7].length; _k++){
      var result = iterativeShit(matrix, center, i, _k, n, totalSlots, tourstops, optimizedTourstops);
      if (result !== null) {
        optimizedTourstops.sumOfSquares = result.sumOfSquares;
        optimizedTourstops.stops = result.stops.slice();
      }
    }
  }
  else {
    // enter matrix[i][j] into the tourstops object
    tourstops.stops[parseInt(i/7)][i%7] = matrix[i%7][j];

    // then remove _matrix[i][j] from _matrix so it doesn't appear again in the decisions tree
    _matrix[i%7].splice(j, 1);
    if (n >= totalSlots - 1) {
      //check if this configuration is better than the old one
      return checkConfiguration(tourstops, center, optimizedTourstops);
    }
    else {
      for(var _j = 0; _j < matrix[(i+1)%7].length; _j++){
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

var checkConfiguration = function(tourstops, center, optimizedTourstops){
  tourstops.sumOfSquares = 0;
  for (var i = 0; i < tourstops.stops.length; i++){
    var beginningSlot = i == 0 ? tourstops.beginningSlot : 0;
    var endingSlot = i == tourstops.stops.length - 1 ? tourstops.endingSlot - 1 : tourstops.stops[i].length - 1;
    // console.log("i is " + i + " and beginningSlot is " + beginningSlot + " and endingSlot is " + endingSlot);

    // if it is the start of travel or the first stop of the day, add the distance to the center (i.e. hotel)
    //console.log(tourstops.stops[i][beginningSlot]);
    tourstops.sumOfSquares += Math.pow(distanceBetweenLatLng(tourstops.stops[i][beginningSlot].location.lat, tourstops.stops[i][beginningSlot].location.lng, center.lat, center.lng), 2);
    // if it is the the last stop of the day, add the distance to the center (i.e. hotel)
    tourstops.sumOfSquares += Math.pow(distanceBetweenLatLng(tourstops.stops[i][endingSlot].location.lat, tourstops.stops[i][endingSlot].location.lng, center.lat, center.lng), 2);
    for (var j = beginningSlot; j < endingSlot; j++){
      // add the distance between the two stops
      tourstops.sumOfSquares += Math.pow(distanceBetween(tourstops.stops[i][j], tourstops.stops[i][j+1]), 2);
    }
  }
  if (tourstops.sumOfSquares < optimizedTourstops.sumOfSquares){
    return tourstops;
  }
  else return null;
};

var category = function(i) {
  switch(i) {
    case 0: // 'Morning 1 - Food or Cafe'
      return "food";
    case 1: // 'Morning 2 - Arts or Sights'
      return "arts";
    case 2: // 'Lunch - Food'
      return "food";
    case 3: // 'Afternoon 1 - Arts or Sights'
      return "food";
    case 4: // 'Afternoon 2 - Shopping or Outdoors'
      return "shopping";
    case 5: // 'Evening - Food'
      return "food";
    case 6: // 'Night - Nightlife'
      return "nightlife";
  }
  return "N/A";
};

var categoryToIndex = function(category, asAnArray) {
  var result = "N/A";
  switch(category) {
    case "cafe":
    case "breakfast": {result = 0; break;} // Morning 1
    case "lunch":     {result = 2; break;} // Lunch
    case "shopping":
    case "outdoors":  {result = 4; break;} // Afternoon 2
    case "dinner":    {result = 5; break;} // Evening
    case "nightlife": {result = 6; break;} // Night
    case "arts":
    case "sights": {
      if (asAnArray) return [1,3];
      result = Math.round(Math.random()) * 2 + 1; // Morning 2 or Afternoon 1
    }
  }

  if(asAnArray) return [result];
  else return result;
};

var getJSON = function(options, onResult) {
  var prot, req;
  prot = options.port === 443 ? https : http;
  req = prot.request(options, function(res) {
    var output;
    output = "";
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      return output += chunk;
    });
    return res.on("end", function() {
      var obj;
      if (res.headers["content-type"].indexOf("json") === -1) {
        return onResult(res.statusCode, {
          error: "response is not JSON"
        });
      } else {
        obj = JSON.parse(output);
        return onResult(res.statusCode, obj);
      }
    });
  });
  req.on("error", function(e) {
    console.log(e);
    return onResult("Unknown error code", {
      error: e.message
    });
  });
  return req.end();
};

var distanceBetweenLatLng = function(lat1, lng1, lat2, lng2){
  //console.log(lat1 + ", " + lng1 + ", " + lat2 + ", " + lng2);
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;
  var R = 6371, //km
    dLat = (lat2-lat1) * Math.PI / 180,
    dLon = (lng2-lng1) * Math.PI / 180,
    a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

var distanceBetween = function(venue1, venue2){
  // console.log(venue1);
  // console.log(venue2);
  return distanceBetweenLatLng(venue1.location.lat, venue1.location.lng, venue2.location.lat, venue2.location.lng);
};

var getMiddleOfLatLongMatrix = function(coordArray) {
  //sums
  var sumLat = 0, sumLong = 0, minRadius = 0;

  //iterate through all coordinates
  var coordCount = 0;
  for (var i = 0; i < coordArray.length; i++) {
    for (var j = 0; j < coordArray[i].length; j++){
    sumLat += coordArray[i][j].location.lat;
    sumLong += coordArray[i][j].location.lng;
    coordCount++;
    }
  }
  sumLat /= coordCount;
  sumLong /= coordCount;

  // go through all coordinates and find maximum distance to center
  // for calculating the MINIMUM RADIUS TO INHERIT ALL COORDINATES
  for (var _i = 0; _i < coordArray.length; _i++) {
    for (var _j = 0; _j < coordArray[_i].length; _j++){
      var tmpRadius = distanceBetweenLatLng(sumLat, sumLong, coordArray[_i][_j].location.lat, coordArray[_i][_j].location.lng);
      if(tmpRadius > minRadius)// radius is bigger hence choose it
        minRadius = tmpRadius;
    }
  }

  return {
    center: {
      lat: sumLat,
      lng: sumLong
    },
    radius: minRadius * 1000
  };
};


// for debugging
var mock_requiredTourstops = {
  arrivalTime: 10,
  numberOfCalendarDays: 3,
  departureTime: 18,
  hotel: {
    lat: 44.07,
    lng: 18.12
  },
  sights: [
      {
        location: {
          lat: 44.1,
          lng: 18.1
        },
        fixedTime: false
      }
    ],
  arts: [
    {
        location: {
          lat: 44.04,
          lng: 18.01
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.09,
          lng: 18.12
        },
        fixedTime: false
      }
    ],
  outdoors: [
    ],
  dinner: [
    {
        location: {
          lat: 44.25,
          lng: 18.03
        },
        fixedTime: false
      },
    ],
  nightlife: [
    ],
  shopping: [
    ],
  lunch: [
    ],
  cafe: [
    ],
  breakfast: [
    ]
};


var mock_itenaryRequest = {
  arrivalTime: 10,
  numberOfCalendarDays: 3,
  departureTime: 18,
  hotel: {
    lat: 44.07,
    lng: 18.12
  },
  stops: [[
      {
        location: {
          lat: 44.1,
          lng: 18.1
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.2,
          lng: 17.9
        },
        fixedTime: false
      }
    ], [
    {
        location: {
          lat: 44.04,
          lng: 18.01
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.09,
          lng: 18.12
        },
        fixedTime: false
      }
    ], [
    {
        location: {
          lat: 44.2,
          lng: 18.12
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.22,
          lng: 18.09
        },
        fixedTime: false
      }
    ], [
    {
        location: {
          lat: 44.25,
          lng: 18.03
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.06,
          lng: 18.12
        },
        fixedTime: false
      }
    ], [
    {
        location: {
          lat: 44.22,
          lng: 18.01
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.17,
          lng: 18.19
        },
        fixedTime: false
      }
    ], [
    {
        location: {
          lat: 44.42,
          lng: 17.81
        },
        fixedTime: false
      },
      {
        location: {
          lat: 44.27,
          lng: 17.99
        },
        fixedTime: false
      }
    ], [
    {
        location: {
          lat: 43.97,
          lng: 18.04
        },
        fixedTime: false
      },
      {
        location: {
          lat: 43.91,
          lng: 18.09
        },
        fixedTime: false
      }
  ]]

};

// LEGACY CODE

/*


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

returnPhase = function(phase) {
  if(phase == 'Morning 1 - Food or Cafe')
    return 0;
  if(phase == 'Morning 2 - Arts or Sights')
    return 1;
  if(phase == 'Lunch - Food')
    return 2;
  if(phase == 'Afternoon 1 - Food or Cafe')
    return 3;
  if(phase == 'Afternoon 2 - Shopping or Outdoors')
    return 4;
  if(phase == 'Evening - Food')
    return 5;
  if(phase == 'Night - Nightlife')
    return 6;
};

var complete = function(tourstopsList, beginningSlot, endingSlot, lenghtOfADay){
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

*/