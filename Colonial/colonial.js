var map;
var hk_pano;
var hk_listener;
var uk_listener;
var uk_pano;
var newZoomLevel;

function initialize() {
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
  // Restrict to only show Hong Kong
  autocomplete.setComponentRestrictions(
      {'country': ['hk']});
  // Restrict to only show streets/roads
  autocomplete.setTypes(['address']);
  // Specify only the data fields that are needed
  autocomplete.setFields(
      ['address_components', 'formatted_address', 'geometry', 'icon', 'name']);

  autocomplete.addListener('place_changed', function(){
    // Get place info
    var place = autocomplete.getPlace();
    console.log(place)
    for (let i=0; i < place.address_components.length; i++){
      if (place.address_components[0].types[0] == "street_number" && place.address_components[1].types[0] == "route"){
        streetname = place.address_components[0].long_name + " " + place.address_components[1].long_name;
        findSameName(streetname);
        console.log("1", streetname)
      } else if (place.address_components[i].types[0] == "route"){
        streetname = place.address_components[i].long_name;
        findSameName(streetname);
        console.log("2", streetname)
      }
    }

    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    showPano(lat, lng)
    console.log(lat, lng)
    // console.log("streetname", streetname)
  })
}

function showPano(lat, lng) {
  // console.log(lat, lng)
  var hk_div = document.getElementById('pano-hk')
  hk_pano = new google.maps.StreetViewPanorama(
      document.getElementById('pano-hk'), {
        position: {lat:lat, lng:lng},
        pov: {
          heading: 270,
          pitch: 0
        },
        zoom: 1,
      });

  google.maps.event.addDomListener(hk_div, 'click', function(){
    google.maps.event.removeListener(uk_listener);
    console.log(hk_pano.getZoom())
    hk_listener = hk_pano.addListener('zoom_changed', function(){
      if (hk_pano.getZoom() <= 4) {
        uk_pano.setZoom(hk_pano.getZoom());
      }
    })
  })
}

function findSameName(streetname){
  var uk_div = document.getElementById('pano-uk')

  geocoder = new google.maps.Geocoder();
  var request = {
      'address': streetname,
      'componentRestrictions': {'country': 'UK'}
  }
    // console.log(streetname)
  geocoder.geocode(request, function(results, status){
    if (status === 'OK') {
      // console.log("results", results)
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      // console.log("uk lat", lat, lng)

      // console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    uk_pano = new google.maps.StreetViewPanorama(document.getElementById('pano-uk'), {
            position: {lat:lat, lng:lng},
            pov: {
              heading: 270,
              pitch: 0
            },
            zoom: 1
          });

          // uk_listener = uk_pano.addListener('zoom_changed', function(){
          //   console.log(uk_pano.getZoom())
          //   google.maps.event.removeListener(hk_listener);
          //   hk_pano.setZoom(uk_pano.getZoom());
          //   google.maps.event.addListener(hk_listener);
          // })

        google.maps.event.addDomListener(uk_div, 'click', function(){
            google.maps.event.removeListener(hk_listener);
            uk_listener = uk_pano.addListener('zoom_changed', function(){
              if(uk_pano.getZoom() <=4){
                hk_pano.setZoom(uk_pano.getZoom());
              }
            })
          })

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
  })
}

// function initMap() {
//   var berkeley = {lat: 37.869085, lng: -122.254775};
//   var sv = new google.maps.StreetViewService();
//
//   panorama = new google.maps.StreetViewPanorama(document.getElementById('pano-hk'));
//
//   // Set up the map.
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: berkeley,
//     zoom: 16,
//     streetViewControl: false
//   });
//
//   // Set the initial Street View camera to the center of the map
//   sv.getPanorama({location: berkeley, radius: 50}, processSVData);
//
//   // Look for a nearby Street View panorama when the map is clicked.
//   // getPanorama will return the nearest pano when the given
//   // radius is 50 meters or less.
//   map.addListener('click', function(event) {
//     sv.getPanorama({location: event.latLng, radius: 50}, processSVData);
//   });
// }
//
// function processSVData(data, status) {
//   if (status === 'OK') {
//     var marker = new google.maps.Marker({
//       position: data.location.latLng,
//       map: map,
//       title: data.location.description
//     });
//       console.log(data.location.latLng)
//
//     panorama.setPano(data.location.pano);
//     panorama.setPov({
//       heading: 270,
//       pitch: 0
//     });
//     panorama.setVisible(true);
//
//     marker.addListener('click', function() {
//       var markerPanoID = data.location.pano;
//       // Set the Pano to use the passed panoID.
//       panorama.setPano(markerPanoID);
//       panorama.setPov({
//         heading: 270,
//         pitch: 0
//       });
//       panorama.setVisible(true);
//     });
//   } else {
//     console.error('Street View data not found for this location.');
//   }
// }
