"use strict"
var userIntention='true'
let specified;
let locations = [];
let numberReviews = 0;
let truckReviewCurrent = 0;
let truckReviews = {};
$(document).ready(function() {
  if (specified) {
    showForm(specified);
  } else {
    showForm('user')
  }
})

$('.signupForm').submit((event) => {
  let up1 = $('#userSignupPassword').val()
  console.log(up1);
  let up2 = $('#userSignupPassword2').val()
  console.log(up2);
  let op1 = $('#ownerSignupPassword').val()
  console.log(op1);
  let op2 = $('#ownerSignupPassword2').val()
  console.log(op2);
  if (up1 === up2 && op1 === op2) {
    console.log("MAtch");
    $('.signupForm').submit();
  } else {
    event.preventDefault();
    $('.signupErrorMessage').text("Passwords do not match!")
  }
})

function showForm(aForm) {
  $('.signupForm').hide()
  let formName = aForm+"SignupForm";
  $('.'+formName).show()
}

function geoCoder(address){
     var formattedAddress = address.split(' ').join('+');
  $.ajax({
    url:'https://maps.googleapis.com/maps/api/geocode/json?address='+formattedAddress+'&key=AIzaSyAMCg6786tQQUE9PoC4RNbsRswkyRqBbVg',
    error: function(err) {console.error(err)},
    method: 'GET',
    success: function(data){
      locations.push(data.results[0].geometry.location)
      return data.results[0].geometry.location;
    }
  })
}

//could i turn this into a $.get and remove error?
function geoCodeAddress(address){
     var formattedAddress = address.split(' ').join('+');
  return $.ajax({
    url:'https://maps.googleapis.com/maps/api/geocode/json?address='+formattedAddress+'&key=AIzaSyAMCg6786tQQUE9PoC4RNbsRswkyRqBbVg',
    error: function(err) {console.error(err)},
    method: 'GET'
  })
}

function loadTruckInfo(id) {
   //$.get('https://hipfoodtrucks.herokuapp.com/api/info/'+id)
  $.get('http://localhost:3000/api/info/'+id)
  .then((data) => {
    console.log(data)
    let truck_data = data.data;
    let review_data = truck_data.reviews;
    $('.selectTruckMessage').hide();
    $('.truckSnapshotName').text(truck_data.truck_name)
    $('.truckSnapshotOpen').text(makeTimeNeat(truck_data.open_time))
    $('.truckSnapshotClose').text(makeTimeNeat(truck_data.close_time))
    $('.truckSnapshotImage').attr('src', truck_data.image_url)
    $('.truckSnapshotLink').attr('href', "/truck/"+id)
    $('.truckSnapshot').css('display', 'flex');
    $('.reviewSnapshotContent').show();
    $('.reviewSnapshotMover').show();
    truckReviewCurrent = 0;
    truckReviews = {};
    numberReviews = review_data.length;
    for (let r in review_data) {
      truckReviews[r] = review_data[r]
    }
    showTruckReview();
  })
}

function showTruckReview() {
  $('.reviewSnapshotContent').text(truckReviews[truckReviewCurrent].content);
}

function nextReview() {
  let nextNumber = truckReviewCurrent + 1;
  if (nextNumber >= numberReviews) {
    truckReviewCurrent = 0;
  } else {
    truckReviewCurrent = nextNumber;
  }
  showTruckReview();
}

function makeTimeNeat(time) {
  let stringTime = String(time);
  let hours, minutes, ampm;
  if (stringTime.length === 3) {
    hours = stringTime.substring(0,1);
    minutes = stringTime.substring(1,3);
  } else {
    hours = stringTime.substring(0,2);
    minutes = stringTime.substring(2,4);
  }
  if (hours > 12) {
    ampm = "PM";
    hours -= 12;
  } else if (hours === 12) {
    ampm = "PM";
  } else {
    ampm = "AM"
  }
  let newStringTime = hours+":"+minutes+" "+ampm;
  return newStringTime;
}

function showAllLocations() {
  for (let l of locations) {
    addMarker(l)
  }
}

function truckSearch() {
  console.log("Searching");
  let method = $('#searchMethod').val();
  let term = $('#searchTerm').val();
  if (method === "near") {
    showAllLocationsWithin(Number(term));
  }
  else if (method === "truckName") {
    showTrucksWithName(term);
  }
  else if (method === "truckType") {
    showTrucksWithType(term);
  }
}

function showAllLocationsWithin(nMiles) {
  console.log("deleting markers");
  deleteMarkers();
  console.log("showing markers within "+nMiles+" miles");
  for (let l of locations) {
    if (haversineDistance(userSpot, l.location) < nMiles) {
      addMarker(l)
    }
  }
}

function showTrucksWithName() {
  deleteMarkers();
  let term = $("#searchTerm").val().toLowerCase();
  for (let l of locations) {
    if (l.truck_name.toLowerCase().includes(term)) {
      addMarker(l)
    }
  }
}

function showTrucksWithType() {
  deleteMarkers();
  let term = $("#searchTerm").val().toLowerCase();
  for (let l of locations) {
    if (l.genre.toLowerCase().includes(term)) {
      addMarker(l)
    }
  }
}

function showDay(day) {
  deleteMarkers();
  for (let l of locations) {
    if (l.date === day) {
      addMarker(l)
    }
  }
}

// Adds a marker to the map and push to the array.
function addMarker(l) {
  let icontitle;
  if (document.URL.indexOf("/truck/") > -1) {
    icontitle = l.date;
  } else {
    icontitle = l.street_address
  }
  var newMarker = new google.maps.Marker({
    map: map,
    position: l.location,
    title: icontitle,
    truck_id: l.truck_id
  });
  google.maps.event.addDomListener(newMarker, 'click', function() {
    loadTruckInfo(newMarker.truck_id)
  });
  markersArray.push(newMarker);
}

// Removes the overlays from the map, but keeps them in the array
function hideMarkers() {
  if (markersArray) {
    for (let i in markersArray) {
      markersArray[i].setMap(null);
    }
  }
}

// Shows any overlays currently in the array
function showMarkers() {
  if (markersArray) {
    for (let i in markersArray) {
      markersArray[i].setMap(map);
    }
  }
}

// Deletes all markers in the array by removing references to them
function deleteMarkers() {
  if (markersArray) {
    for (let i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}
