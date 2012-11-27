define(
  [ 
    'backbone',
    'markerclusterer',
    'plugins/backbone.mapview',
    'libs/utils'
  ],
  function(Backbone) {
    return Backbone.MapView.extend({
      initialize: function() {
        Backbone.MapView.prototype.initialize.call(this, arguments);

        // initialize marker clusterer
        this.clusterer = new MarkerClusterer(this.map, [], {
          averageCenter : true,
          maxZoom       : 15
        });

        // handle collection events
        this.collection.on('tweets:add', this.onTweetsAdd);

        // user hasn't yet interacted with map
        this.interacted = false;

        // debounce bounding-box-change-events
        var callback = _.debounce(this.bbChanged, 1000);
        this.on('map:zoom_changed', callback);
        this.on('map:dragend',      callback);
      },
      onTweetsAdd : function() {
        var markers = [];
        this.collection.each(function(tweet) {
          // create marker
          var marker = this.addMarker({
            lat     : tweet.get('geo').coordinates[0],
            lng     : tweet.get('geo').coordinates[1],
            label   : tweet.get('from_user') + ': ' + tweet.get('text'),
            events  : {
              mouseover : function() { tweet.trigger('tweet:focus') },
              mouseout  : function() { tweet.trigger('tweet:blur') }
            }
          });

          // listen to focus/blur events
          tweet.on('tweet:focus', function() {
            marker.setIcon('http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png');
          });
          tweet.on('tweet:blur', function() {
            marker.setIcon('http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png');
          });

          // push marker on list
          markers.push(marker);
        }, this);
        // remove old markers from clusterer
        this.clusterer.clearMarkers();
        // add new markers to clusterer
        this.clusterer.addMarkers(markers);
      },
      bbChanged : function() {
        // user interacted with the map
        this.interacted = true;

        // get map bounds
        var bounds    = this.map.getBounds();

        // bounds can be null
        if (! bounds)
          return;

        // calculate radius (as distance between center and NE corner of bounding box)
        var center    = bounds.getCenter();
        var radius    = google.maps.geometry.spherical.computeDistanceBetween(bounds.getNorthEast(), center);

        // limit radius to 20km
        radius = Math.min(radius / 1000, 20);
        console.log('looking within a radius of', radius, 'km');

        // setup query to pass to Twitter API
        var geoquery  = center.toUrlValue() + ',' + radius + 'km';

        // fetch collection
        this.collection.fetch(center.toUrlValue(), radius);
      }
  });
});
