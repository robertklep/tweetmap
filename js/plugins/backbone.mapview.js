Backbone.MapView = Backbone.View.extend({
  tagName     : 'div',
  initialize  : function() {
    _.bindAll(this);

    // instantiate map
    this.map = new google.maps.Map(this.$el.get(0), {
      center    : new google.maps.LatLng(52.243333, 5.634167),
      zoom      : 8,
      mapTypeId : google.maps.MapTypeId.HYBRID
    });

    // delegate map events to MapView
    var this_   = this;
    var events  = [ "bounds_changed", "center_changed", "click", "dblclick", "drag", "dragend", "dragstart", "heading_changed", "idle", "maptypeid_changed", "mousemove", "mouseout", "mouseover", "projection_changed", "resize", "rightclick", "tilesloaded", "tilt_changed", "zoom_changed" ];
    _.each(events, function(event) {
      google.maps.event.addListener(this_.map, event, function() {
        this_.trigger('map:' + event, arguments);
      });
    });
  },
  addCurrentLocationMarker  : function(opts) {
    if (! navigator || ! navigator.geolocation)
      return;

    // get current position and display it on the map
    var this_ = this;
    navigator.geolocation.getCurrentPosition(function(pos) {
      this_.addMarker(_.extend({
          lat   : pos.coords.latitude,
          lng   : pos.coords.longitude
        }, opts)
      );
      if (opts.center)
        this_
          .setCenter(pos.coords.latitude, pos.coords.longitude)
          .setZoom(opts.zoom || 15);
    });
  },
  addMarker   : function(opts) {
    // create marker instance
    var marker = new google.maps.Marker({
      position  : opts.position || new google.maps.LatLng(opts.lat, opts.lng),
      map       : this.map,
      title     : opts.label,
      icon      : opts.icon || 'http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png'
    });

    // set event handlers
    _.each(opts.events || {}, function(handler, event) {
      google.maps.event.addListener(marker, event, _.bind(handler, marker));
    });

    // return marker
    return marker;
  },
  setCenter   : function(lat, lng) {
    this.map.setCenter(new google.maps.LatLng(lat, lng));
    return this;
  },
  setZoom     : function(level) {
    this.map.setZoom(level);
    return this;
  },
  render      : function() {
    return this.$el;
  }
});

