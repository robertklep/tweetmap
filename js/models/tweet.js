define(
  [ 'backbone' ],
  function(Backbone) {
    return Backbone.Model.extend({
      initialize  : function() {
        // set age of tweet
        this.set('age', new Date(this.get('created_at')).age({ 
          short   : true,
          reverse : true
        }));
      }
    });
  }
);
