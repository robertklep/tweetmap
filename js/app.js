define(
  [ 'views/main' ],
  function(MainView) {
    // render main view and append it to BODY
    new MainView().render().appendTo('body');
  }
);
