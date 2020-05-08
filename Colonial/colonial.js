var map;
var hk_pano;
var uk_pano;
var over;
var styledMap;

function initialize() {
  var world_map = new google.maps.Map(document.getElementById('world-map'),{
    zoom: 3,
    center: {lat: 40.95, lng: 11.72},
    mapTypeId: 'terrain',
    disableDefaultUI: true,
  });

  var flightpaths = [
    {lat: 22.302711, lng: 114.177216},
    {lat: 51.509865, lng: -0.118092}
  ]

  var lineSymbol = {
    path: 'M 0,-1 0,1',
    scale: 2,
    strokeColor: '#ff6420',
  };

  var flightPath = new google.maps.Polyline({
      path: flightpaths,
      icons:[{
        icon: lineSymbol,
        offset: '0',
        repeat: '10px'
      }],
      map: world_map,
      geodesic: true,
      strokeWeight: 0
  });

  animateCircle(flightPath)

  // flightPath.setMap(world_map);

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
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff4800"
            },
            {
                "gamma": "1.89"
            },
            {
                "saturation": "74"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -31
            },
            {
                "lightness": -33
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.8
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#f9bd94"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#938d8d"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": 30
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
])
world_map.mapTypes.set('styled_map', styledMapType);
world_map.setMapTypeId('styled_map');
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
    fullscreenControl: false,
    linksControl: false,
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
        fullscreenControl: false,
        linksControl: false,
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

function animateCircle(flightPath) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = flightPath.get('icons');
      icons[0].offset = (count / 2) + '%';
      flightPath.set('icons', icons);
  }, 100);
}

// $(window).scroll(function() {
//   if ($(this).scrollTop()> 200){
//       $('.intro-container').fadeOut();
//       $('.streetview-container').fadeIn();
//    }
//   else {
//     // $('.intro-container').fadeIn();
//     // $('.streetview-container').fadeOut();
//   }
//  });
