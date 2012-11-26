TweetMap.Tweets = Backbone.Collection.extend({
  model       : TweetMap.Tweet,
  initialize  : function(opts) {
    Backbone.Collection.prototype.initialize.call(this, arguments);
    opts      = opts || {};
    this.rpp  = opts.rpp || 10;
  },
  fetch : function(center, radius) {
    var geoquery = center + ',' + radius + 'km';
    this.url = 'http://search.twitter.com/search.json?q=&rpp=' + this.rpp + '&callback=?&geocode=' + geoquery;
    Backbone.Collection.prototype.fetch.call(this);
  },
  parse : function(response) {
    _.each(response.results, function(result) {
      if (result.geo)
        this.add(new TweetMap.Tweet(result), { silent : true });
    }, this);
    this.trigger('tweets:add');
  }
});
