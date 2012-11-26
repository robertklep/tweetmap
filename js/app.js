define(
  [ 'jquery', 'lodash', 'backbone', 'views/mapview' ],
  function($, _, Backbone, MapView) {
    // render mapview and append it to BODY
    var mapview = new MapView({ id : 'map_canvas' });
    mapview.render().appendTo('body');

    // add current location on map
    mapview.addCurrentLocationMarker({
      label   : 'Current Location',
      center  : ! mapview.interacted
    });
  }
);
