define(
  [ 'backbone', 'models/tweet' ],
  function(Backbone, Tweet) {
    return Backbone.Collection.extend({
      model       : Tweet,
      initialize  : function(opts) {
        Backbone.Collection.prototype.initialize.call(this, arguments);
        opts      = opts || {};
        this.rpp  = opts.rpp || 100;
      },
      fetch : function(center, radius) {
        var geoquery = center + ',' + radius + 'km';
        this.url = 'http://search.twitter.com/search.json?q=&rpp=' + this.rpp + '&callback=?&geocode=' + geoquery;
        Backbone.Collection.prototype.fetch.call(this);
      },
      parse : function(response) {
        var i = 0;
        _.each(response.results, function(result) {
          if (i++ == 0)
            console.log('result', result);
          if (result.geo)
            this.add(new Tweet(result), { silent : true });
        }, this);
        this.trigger('tweets:add');
      },
      comparator : function(tweet) {
        // assume ids are ascending
        return -tweet.get('id');
      }
    });
  }
);
