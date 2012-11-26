TweetMap.MapView = Backbone.MapView.extend({
  initialize: function() {
    Backbone.MapView.prototype.initialize.call(this, arguments);

    // initialize marker clusterer
    this.clusterer = new MarkerClusterer(this.map, [], {
      averageCenter : true,
      maxZoom       : 15
    });

    // initialize tweet collection
    this.tweets = new TweetMap.Tweets();

    // handle collection events
    this.tweets.on('tweets:add', this.onTweetsAdd);

    // user hasn't yet interacted with map
    this.interacted = false;

    // throttle events
    var callback = throttle(this.bbChanged, 1000);
    this.on('map:zoom_changed', callback);
    this.on('map:dragend',      callback);
  },
  onTweetsAdd : function() {
    var markers = [];
    this.tweets.each(function(tweet) {
      // create marker
      var marker = new google.maps.Marker({
        position  : new google.maps.LatLng(tweet.get('geo').coordinates[0], tweet.get('geo').coordinates[1]),
        title     : tweet.get('from_user') + ': ' + tweet.get('text'),
        //icon      : blueIcon
      });

      // determine age of marker
      tweet.set('age', new Date(tweet.get('created_at')).age());

      // setup event handlers
      /*
      google.maps.event.addListener(marker, 'mouseover', function() {
        $tweet.html(
          template.replace(/{(.*?)}/g, function(match, keyword) {
            return result[keyword];
          })
        ).css('opacity', '1.0');
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        $tweet.css('opacity', '0.0');
      });
      google.maps.event.addListener(marker, 'click', function() {
        window.open('http://twitter.com/' + result.from_user, '_blank');
      });
      */

      markers.push(marker);
    });
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

    this.tweets.fetch(center.toUrlValue(), radius);
    return;

    // perform Twitter request
    var this_ = this;
    $.getJSON('http://search.twitter.com/search.json?q=&rpp=100&callback=?&geocode=' + geoquery, function(response) {
      // process results
      var markers = [];
      response.results.forEach(function(result) {
        if (! result.geo)
          return;

        // create marker
        var marker = new google.maps.Marker({
          position  : new google.maps.LatLng(result.geo.coordinates[0], result.geo.coordinates[1]),
          title     : result.from_user + ': ' + result.text,
          //icon      : blueIcon
        });

        // determine age of marker
        result.age = new Date(result.created_at).age();

        // setup event handlers
        /*
        google.maps.event.addListener(marker, 'mouseover', function() {
          $tweet.html(
            template.replace(/{(.*?)}/g, function(match, keyword) {
              return result[keyword];
            })
          ).css('opacity', '1.0');
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
          $tweet.css('opacity', '0.0');
        });
        google.maps.event.addListener(marker, 'click', function() {
          window.open('http://twitter.com/' + result.from_user, '_blank');
        });
        */

        markers.push(marker);
      });
      // remove old markers from clusterer
      this_.clusterer.clearMarkers();
      // add new markers to clusterer
      this_.clusterer.addMarkers(markers);
    });
  }
});
