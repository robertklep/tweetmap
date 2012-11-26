define(
  [ 'backbone', 'lodash', 'jquery' ],
  function(Backbone, _, $) {
    return Backbone.View.extend({
      tagName     : 'li',
      attributes  : { 'class' : 'tweet' },
      template    : _.template( $('#tweet-template').text() ),
      render      : function() {
        this.$el.html( this.template( this.model.toJSON() ) );
        return this.$el;
      }
    });
  }
);
