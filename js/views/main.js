define(
  [ 'backbone', 'collections/tweets', 'views/tweets', 'views/map' ],
  function(Backbone, TweetsCollection, TweetsView, MapView) {
    return Backbone.View.extend({
      id          : 'main-view',
      initialize  : function() {
        // initialize tweet collection
        this.tweets = new TweetsCollection();

        // instantiate tweets view
        this.tweetsview = new TweetsView({ 
          id          : 'tweets',
          collection  : this.tweets
        });

        // instantiate map view
        this.mapview    = new MapView({ 
          id          : 'map-canvas',
          collection  : this.tweets
        });

        // add current location on map
        this.mapview.addCurrentLocationMarker({
          label   : 'Current Location',
          icon    : 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',
          center  : ! this.mapview.interacted
        });
      },
      render  : function() {
        return this.$el
          // clear element
          .empty()
          // add tweets (list) view
          .append( this.tweetsview.render() )
          // add map view
          .append( this.mapview.render() );
      }
    });
  }
);
