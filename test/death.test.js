var spawn = require('child_process').spawn //require('win-spawn')
  , P = require('autoresolve')
  , testutil = require('testutil')
  , colors = require('colors')

describe('death', function() {
  describe('default behavior', function() {
    it('should catch SIGINT, SIGTERM, and SIGQUIT and return 3', function(done) {
      var signals = []
      var progPath = P('test/resources/default')
      var prog = spawn(progPath, [])
      //console.dir(prog)

      prog.stdout.on('data', function(data) {
        //console.log(colors.cyan(data.toString()))
      })

      prog.stderr.on('data', function(data) {
        //console.error(colors.red(data.toString()))
        signals.push(data.toString().trim())
      })

      prog.on('exit', function(code) {
        EQ (code, 3)
        T (signals.indexOf('SIGQUIT') >= 0)
        T (signals.indexOf('SIGTERM') >= 0)
        T (signals.indexOf('SIGINT') >= 0)
        done()
      })

      setTimeout(function() {
        prog.kill('SIGINT')
        process.kill(prog.pid, 'SIGTERM')
        prog.kill('SIGQUIT')
      }, 100)
      
    })
  })
})