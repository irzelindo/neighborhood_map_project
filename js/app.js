var map;
var markers = [];
var client_id = 'VN2LJJYQQ0JD25VPSV1R4HGPRVFMJVL1B1R253JKIOSTRCLK';
var client_secret = 'ZXZQNVS2PLIQERP032C4QZPBFACAMHIYFRU0QWJX4S0II2E3';

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -25.923909,
      lng: 32.465802
    },
    zoom: 15,
    mapTypeControl: false
  });

  var markerInfoWindow = new google.maps.InfoWindow();
  var uri = 'https://api.foursquare.com/v2/venues/search?client_id=' + client_id + '&client_secret=' + client_secret + '&ll=-25.965118,32.455710&v=20170801';
  $.getJSON(uri).done(function(data) {
    var points = data.response.venues;
    var defaultIcon = 'img/default-icon.png';
    var hoverIcon = 'img/hover-icon.png';
    console.log(points);
    for (var i = 0; i < points.length; i++) {
      var title = points[i].name;
      var latitude = points[i].location.lat;
      var longitude = points[i].location.lng;
      var phone_nr = points[i].contact.formattedPhone;
      var country_name = points[i].location.country
      var category_name = points[i].categories[0].name
      var marker = new google.maps.Marker({
        title: title,
        position: {
          lat: latitude,
          lng: longitude
        },
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        phone: phone_nr,
        country: country_name,
        category: category_name,
        id: i
      });
      markers.push(marker);

      marker.addListener('click', function() {
        showInfoWindow(this, markerInfoWindow)
      });

      marker.addListener('mouseover', function() {
        this.setIcon(hoverIcon);
      });

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

    }
    showIcons();
  }).fail(function() {
    alert('Error loading foursquare api');
  });
}

function showIcons() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

function showInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.setContent('...');
    infowindow.marker = marker;
    var name = marker.title || "Ohh! we don't have this place name";
    var phone = marker.phone || "No phone provided";
    var country = marker.country || "Ohh! we don't have country name";
    var category = marker.category || "Ohh! we don't have category name";
    var content =
      '<div id="pano">' +
      '<strong>' + name + '</strong>' +
      '<hr />' +
      '<p>' + country + '</p>' +
      '<p>' + category + '</p>' +
      '<p>' + phone + '</p>' +
      //'<p class="fs-data">'+ self.country+'</p>' +
      '</div>';
    infowindow.setContent(content);
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("map").style.marginLeft = "300px";
  $("#sidenav-icon").hide(500);
  $("#closebtn").show(500);
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("map").style.marginLeft = "0";
  $("#closebtn").hide();
  $("#sidenav-icon").show(500);
}