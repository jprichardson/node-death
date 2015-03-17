
var defaultConfig = {
  uncaughtException: false,
  SIGINT: true,
  SIGTERM: true,
  SIGQUIT: true
}

var DEBUG = false

function ON_DEATH (callback) {
  Object.keys(defaultConfig).forEach(function(key) {
    var val = defaultConfig[key]
    if (val) {
      if (DEBUG)
        process.on(key, function() {
          var args = Array.prototype.slice.call(arguments, 0)
          args.unshift(key)
          console.log('Trapped ' + key)
          callback.apply(null, args)
        })
      else
        process.on(key, function() {
          var args = Array.prototype.slice.call(arguments, 0)
          args.unshift(key)
          callback.apply(null, args)
        })
    }
  })
}

module.exports = function (arg) {
  if (typeof arg === 'object') {
    if (arg['debug'])
      DEBUG = arg.debug
    if (arg['DEBUG'])
      DEBUG = arg.DEBUG
    delete arg.debug; delete arg.DEBUG;

    Object.keys(arg).forEach(function(key) {
      defaultConfig[key] = arg[key]
    })

    if (DEBUG)
      console.log('ON_DEATH: debug mode enabled for pid [%d]', process.pid)

    return ON_DEATH
   } else if (typeof arg === 'function') {
    ON_DEATH(arg)
  }
}

