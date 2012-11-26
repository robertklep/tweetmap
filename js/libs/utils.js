// http://remysharp.com/2010/07/21/throttling-function-calls/
function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

// make a humanized age string
Date.prototype.AGE_TABLE = [
  [         60, 'second'  , 'seconds' ],
  [       3600, 'minute'  , 'minutes' ],
  [      86400, 'hour'    , 'hours'   ],
  [     604800, 'day'     , 'days'    ],
  [    2628030, 'week'    , 'weeks'   ],
  [   31557600, 'month'   , 'months'  ],
  [ 4294967295, 'year'    , 'years'   ]
];

Date.prototype.age = function(humanized) {
  // shortcuts
  if (humanized)
  {
    var today     = new Date().setHours(0, 0, 0, 0);
    var tomorrow  = new Date(new Date(today).setHours(26, 0, 0, 0)).setHours(0, 0, 0, 0);
    var yesterday = new Date(new Date(today).setHours(-22, 0, 0, 0)).setHours(0, 0, 0, 0);
    var thisdate  = new Date(this).setHours(0, 0, 0, 0);

    if (thisdate == today)      return "Today";
    if (thisdate == tomorrow)   return "Tomorrow";
    if (thisdate == yesterday)  return "Yesterday";
  }

  // determine age in seconds
  var seconds = (new Date() - this) / 1000.0;

  // future time?
  var future  = seconds < 0;

  // convert to absolute
  seconds = Math.abs(seconds);

  // walk through age table
  var suffix  = '';
  var divider = 1;
  for (var i = 0; i < this.AGE_TABLE.length; i++)
  {
    var secs      = this.AGE_TABLE[i][0];
    var singular  = this.AGE_TABLE[i][1];
    var plural    = this.AGE_TABLE[i][2];

    if (seconds < secs)
    {
      seconds /= divider;
      suffix  = (parseInt(seconds) > 1) ? plural : singular;
      break;
    }
    divider = secs;
  };

  return (future ? 'in ' : '') + parseInt(seconds) + ' ' + suffix + (future ? '' : ' ago');
};

// softbreak a string by inserting soft hyphens
String.prototype.softbreak = function(minimum_size) {
  return this
    .toString()
    .replace(
      new RegExp('(.{' + (minimum_size || 5) + '})', 'g'),
      '$1&shy;'
    );
};
