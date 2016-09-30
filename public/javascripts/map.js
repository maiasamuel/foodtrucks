"use strict"
let tempy;
let userSpot;
let userLocation, map, truckmap;
let markersArray = [];
function initMap() {
  let lat, lon, maptype, anId;
  if (document.URL.indexOf("/truck/") > -1) {
    maptype = "truck";
    console.log("this is a truck page");
    anId = document.URL.split("/").reverse()[0]
  } else {
    maptype = "main";
  }
  navigator.geolocation.getCurrentPosition(function (position) {
      var geocoder = new google.maps.Geocoder();
      var latLng   = new google.maps.LatLng(
          position.coords.latitude, position.coords.longitude);
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      // userlocation = {lat: lat, lng: lon};
      var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
      let userLocation = myLatLng;
      userSpot = userLocation;
      // Create a map object and specify the DOM element for display.
      map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: false,
        zoom: 10
      });
      // var marker = new google.maps.Marker({
      //   map: map,
      //   position: myLatLng,
      //   title: 'You are here!'
      // });
      if (maptype === "main") {
         //$.get('https://hipfoodtrucks.herokuapp.com/today/locations')
        $.get('http://localhost:3000/today/locations')
        .then((data) => {
          console.log("this is what our get to /today/locations returns ",data);
          let promises = [];
          for (let d of data) {
            d.street_address = d.location;
            locations.push(d);
            promises.push(geoCodeAddress(d.location));
          }
          return Promise.all(promises)
        })
        // data below is an array containing results of promises returned by requests to the geocoder api
        .then((data) => {
          tempy = data;
          for (let d in data) {
            console.log(d)
            locations[d].location = data[d].results[0].geometry.location;
          }
        })
        .then(() => {
          showAllLocationsWithin(5);
        })
      } else if (maptype === "truck") {
         //$.get('https://hipfoodtrucks.herokuapp.com/api/schedule/'+anId)
        $.get('http://localhost:3000/truck/schedule/'+anId)
        .then((data) => {
          console.log("this is what our get to /today/locations returns ",data);
          let promises = [];
          for (let d of data) {
            d.street_address = d.location;
            locations.push(d);
            promises.push(geoCodeAddress(d.location));
          }
          return Promise.all(promises)
        })
        // data below is an array containing results of promises returned by requests to the geocoder api
        .then((data) => {
          tempy = data;
          for (let d in data) {
            console.log(d)
            locations[d].location = data[d].results[0].geometry.location;
          }
        })
        .then(() => {
          showAllLocations();
        })
      }
  })
}


function haversineDistance(coords1, coords2) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lon1 = coords1.lng;
  var lat1 = coords1.lat;

  var lon2 = coords2.lng;
  var lat2 = coords2.lat;

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  let distance_between = d /= 1.60934
  return distance_between;
}
