var map;
// Foursquare Api client ID and Secret
var client_id = 'VN2LJJYQQ0JD25VPSV1R4HGPRVFMJVL1B1R253JKIOSTRCLK';
var client_secret = 'ZXZQNVS2PLIQERP032C4QZPBFACAMHIYFRU0QWJX4S0II2E3';

function ViewModel() {

  var self = this;
  // Creatin an empty markers array
  self.markers = [];

  self.defaultIcon = 'img/default-icon.png'; // default icon image
  self.hoverIcon = 'img/hover-icon.png'; // change icon image on mouse click

  // Initializing places search box
  self.findPlace = ko.observable('');

  self.sideList = ko.observableArray([]);

  this.initMap = function() {
    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -25.923909,
        lng: 32.465802
      },
      zoom: 15,
      mapTypeControl: false
    });

    // Creating infowindow instance
    self.markerInfoWindow = new google.maps.InfoWindow();

    // Foursquare api request, to get near locations and push to markers array
    uri = 'https://api.foursquare.com/v2/venues/search?client_id=' + client_id + '&client_secret=' + client_secret + '&ll=-25.965118,32.455710&v=20170801';
    $.getJSON(uri).done(function(data) {
      points = data.response.venues; // assiggn locations to points
      for (var i = 0; i < points.length; i++) {
        self.title = points[i].name;
        self.latitude = points[i].location.lat;
        self.longitude = points[i].location.lng;
        self.phone_nr = points[i].contact.formattedPhone;
        self.country_name = points[i].location.country;
        self.category_name = points[i].categories[0].name;

        // Creating a marker in each iteration
        self.marker = new google.maps.Marker({
          title: self.title,
          position: {
            lat: self.latitude,
            lng: self.longitude
          },
          animation: google.maps.Animation.DROP,
          icon: self.defaultIcon,
          phone: self.phone_nr,
          country: self.country_name,
          category: self.category_name,
          id: i
        });

        // Push created marker to the markers array
        self.markers.push(self.marker);

        // Adding events listeners for each marker
        self.marker.addListener('click', self.populateMark);
      }
      self.showIcons();
    }).fail(function() {
      alert('Error loading foursquare api');
    });
  };

  this.initMap();

  this.locationList = ko.computed(function() {
    var result = [];
    if (self.findPlace()) {
      //console.log(self.findPlace());
      for (var i = 0; i < self.sideList().length; i++) {
        var location = self.sideList()[i];
        if (location.title.toLowerCase().includes(this.findPlace().toLowerCase())) {
          result.push(location);
          self.sideList()[i].setVisible(true);
          self.sideList()[i].setIcon(self.hoverIcon);
        } else {
          self.sideList()[i].setVisible(false);
        }
      }
      return result;
    } else if (self.findPlace() === '') {
      return self.sideList();
    }
  }, this);

  this.populateMark = function() {
    self.showInfoWindow(this, self.markerInfoWindow);
  };


  this.showIcons = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < self.markers.length; i++) {
      self.markers[i].setMap(map);
      self.sideList.push(self.markers[i]);
      bounds.extend(self.markers[i].position);
    }
    map.fitBounds(bounds);
  };

  this.showInfoWindow = function(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.setContent('processing...');
      infowindow.marker = marker;
      self.name = marker.title || "Ohh! we don't have this place name";
      self.phone = marker.phone || "phone number not provided";
      self.country = marker.country || "Ohh! we don't have country name";
      self.category = marker.category || "Ohh! we don't have category name";
      self.content =
        '<div id="pano">' +
        '<strong>' + self.name + '</strong>' +
        '<hr />' +
        '<p>' + self.country + '</p>' +
        '<p>' + self.category + '</p>' +
        '<p>' + self.phone + '</p>' +
        //'<p class="fs-data">'+ self.country+'</p>' +
        '</div>';
      infowindow.setContent(self.content);
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        marker.setIcon(self.defaultIcon);
      });
      marker.setIcon(self.hoverIcon);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout((function() {
        marker.setAnimation(null);
      }).bind(marker), 1000);
    }
  };

  /* Set the width of the side navigation to 250px and the left margin of the page content to 350px */
  this.openNav = function() {
    document.getElementById("mySidenav").style.width = "300px";
    document.getElementById("map").style.marginLeft = "300px";
    $("#sidenav-icon").hide(500);
    $("#closebtn").show(500);
  };

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  this.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
    $("#closebtn").hide();
    $("#sidenav-icon").show(500);
  };


}

function cannotLoadMap() {
  alert('Error trying to load the map. Check your internet connectivity');
}

function createMap() {
  ko.applyBindings(new ViewModel());
}