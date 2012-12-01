
var defaultConfig = {
  uncaughtException: true,
  SIGINT: true,
  SIGTERM: true,
  SIGQUIT: true
}

var DEBUG = false

function ON_DEATH (callback) {
  Object.keys(defaultConfig).forEach(function(key) {
    if (DEBUG)
      process.on(key, function() {
        console.log('Trapped ' + key)
        callback.apply(null, arguments)
      })
    else 
      process.on(key, callback)
  })
}

module.exports = function (arg) {
  if (typeof arg === 'object') {
    DEBUG = arg.debug || arg.DEBUG
    delete arg.debug; delete arg.DEBUG;

    defaultConfig.uncaughtException = arg.ue || arg.uncaught || arg.exception || true
    delete arg.ue; delete arg.uncaught; delete arg.exception

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

