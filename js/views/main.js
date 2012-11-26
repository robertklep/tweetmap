define(
  [ 'backbone', 'views/tweets', 'views/map' ],
  function(Backbone, TweetsView, MapView) {
    return Backbone.View.extend({
      id          : 'main-view',
      initialize  : function() {
        // instantiate mapview
        this.mapview = new MapView({ id : 'map-canvas' });

        // add current location on map
        this.mapview.addCurrentLocationMarker({
          label   : 'Current Location',
          icon    : 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',
          center  : ! this.mapview.interacted
        });
      },
      render  : function() {
        // clear element
        this.$el.html();

        // add mapview to current view
        this.mapview.render().appendTo( this.$el );

        // done
        return this.$el;
      }
    });
  }
);
