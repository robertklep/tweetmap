define(
  [ 'backbone', 'lodash', 'jquery' ],
  function(Backbone, _, $) {
    return Backbone.View.extend({
      tagName     : 'li',
      template    : _.template( $('#tweet-template').text() ),
      initialize  : function() {
        _.bindAll(this);

        // listen to focus/blur events on model for visual feedback
        this.model.on('tweet:focus', this.onFocus);
        this.model.on('tweet:blur', this.onBlur);
      },
      render      : function() {
        this.$el.html( this.template( this.model.toJSON() ) );
        return this.$el;
      },
      onFocus     : function() { this.$el.   addClass('focussed') },
      onBlur      : function() { this.$el.removeClass('focussed') }
    });
  }
);
