define(
  [ 'backbone', 'lodash', 'views/tweet' ],
  function(Backbone, _, TweetView) {
    return Backbone.View.extend({
      tagName     : 'ul',
      initialize  : function() {
        _.bindAll(this);
        // handle collection events
        this.collection.on('tweets:add', this.onTweetsAdd);
      },
      onTweetsAdd : function() {
        this.render();
      },
      render      : function() {
        this.$el.empty();
        this.collection.each(function(tweet) {
          this.$el.append( new TweetView({ 
            model : tweet,
            id    : 'tweet-' + tweet.get('id')
          }).render() );
        }, this);
        return this.$el;
      }
    });
  }
);
