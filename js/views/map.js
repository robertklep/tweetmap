define(
  [ 
    'backbone',
    'markerclusterer',
    'plugins/backbone.mapview',
    'libs/throttle',
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

        // throttle events
        var callback = throttle(this.bbChanged, 1000);
        this.on('map:zoom_changed', callback);
        this.on('map:dragend',      callback);
      },
      onTweetsAdd : function() {
        var markers = [];
        this.collection.each(function(tweet) {
          // set age of tweet
          tweet.set('age', new Date(tweet.get('created_at')).age());

          // create marker
          markers.push(this.addMarker({
            lat     : tweet.get('geo').coordinates[0],
            lng     : tweet.get('geo').coordinates[1],
            label   : tweet.get('from_user') + ': ' + tweet.get('text'),
            events  : {
              mouseover : function() {
                this.setIcon('http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png');
                tweet.trigger('tweet:focus');
              },
              mouseout : function() {
                this.setIcon('http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png');
                tweet.trigger('tweet:blur');
              }
            }
          }));
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
