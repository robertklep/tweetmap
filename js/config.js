// configure require.js
require.config({
  // bust cache
  urlArgs : "bust=" +  (new Date()).getTime(),

  // initialize the application with the main application file
  deps    : [ 'main' ],
  paths   : {
    // folders
    libs            : 'libs',
    plugins         : 'plugins',
    // common libraries
    jquery          : 'libs/jquery',
    backbone        : 'libs/backbone',
    lodash          : 'libs/lodash',
    markerclusterer : 'libs/markerclusterer'
  },

  shim: {
    // Backbone library depends on jQuery and lodash
    backbone: {
      deps    : [ 'lodash', 'jquery' ],
      exports : 'Backbone'
    },
    // backbone-mapview depends on backbone
    'plugins/backbone.mapview': [ 'backbone' ]
  }
});
