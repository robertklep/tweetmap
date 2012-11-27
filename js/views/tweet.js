define(
  [ 'backbone', 'lodash', 'jquery' ],
  function(Backbone, _, $) {
    return Backbone.View.extend({
      tagName     : 'li',
      template    : _.template( $('#tweet-template').text() ),
      initialize  : function() {
        _.bindAll(this);
        
        // generate focus/blur events on mouseover/-out
        var model = this.model;
        this.$el
          .on('mouseover', function() { model.trigger('tweet:focus') })
          .on('mouseout',  function() { model.trigger('tweet:blur') });

        // listen to focus/blur events on model for visual feedback
        model.on('tweet:focus', this.onFocus);
        model.on('tweet:blur', this.onBlur);
      },
      render      : function() {
        var model = this.model.toJSON();

        // fix links in tweet text
        model.text = model.text.replace(/(https?:\/\/\S+)/g, '<a href="$1">$1</a>');

        // render template into element
        this.$el.html( this.template(model) );
        return this.$el;
      },
      onFocus     : function() { this.$el.   addClass('focussed') },
      onBlur      : function() { this.$el.removeClass('focussed') }
    });
  }
);
