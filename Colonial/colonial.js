var map;
var hk_pano;
var uk_pano;
var over;
var styledMap;

function initialize() {
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
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
  })

  styledMapType = new google.maps.StyledMapType([
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#fcfcfc"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#fcfcfc"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#dddddd"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#dddddd"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#dddddd"
            }
        ]
    }
])
}

function showPano(lat, lng) {
  var map = new google.maps.Map(document.getElementById('map-hk'), {
      center: {lat:lat, lng:lng},
      zoom: 11,
      fullscreenControl: false,
  });

  var hk_div = document.getElementById('pano-hk')
  var map_options = {
    position: {lat:lat, lng:lng},
    pov: {heading: 250,pitch: 0},
    zoom: 1,
    mapTypeControlOptions: {
      mapTypeIds: ['styled_map']
    },
    fullscreenControl: false
  }
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  hk_pano = new google.maps.StreetViewPanorama(document.getElementById('pano-hk'), map_options);
  map.setStreetView(hk_pano);

  google.maps.event.addListener(hk_pano, 'pov_changed', function() {
      if(over==hk_div)
      {
        uk_pano.setPov({ heading: hk_pano.getPov().heading , pitch: hk_pano.getPov().pitch, zoom: hk_pano.getPov().zoom });
      }
    });
    google.maps.event.addDomListener(hk_div, 'mouseover', function() {
        over=this;});
}

function findSameName(streetname){
  var uk_div = document.getElementById('pano-uk');

  geocoder = new google.maps.Geocoder();
  var request = {
      'address': streetname,
      'componentRestrictions': {'country': 'UK'}
  }

  geocoder.geocode(request, function(results, status){
    if (status === 'OK') {
      // console.log("results", results)
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();

      var map = new google.maps.Map(document.getElementById('map-uk'), {
          center: {lat:lat, lng:lng},
          zoom: 6,
          fullscreenControl: false,
      });

      var map_options = {
        position: {lat:lat, lng:lng},
        pov: {heading: 250,pitch: 0},
        zoom: 1,
        mapTypeControlOptions: {
          mapTypeIds: ['styled_map']
        },
        fullscreenControl: false
      }
      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');

      uk_pano = new google.maps.StreetViewPanorama(document.getElementById('pano-uk'), map_options);
      map.setStreetView(uk_pano);

      google.maps.event.addListener(uk_pano, 'pov_changed', function() {
      if(over==uk_div){
        hk_pano.setPov({ heading: uk_pano.getPov().heading , pitch: uk_pano.getPov().pitch, zoom: uk_pano.getPov().zoom });
      }
      });
      google.maps.event.addDomListener(uk_div, 'mouseover', function() {
        over=this;});

      } else {
        alert("No streets found in the UK, please try a different entry.");
      }
  })
}
