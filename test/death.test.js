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
        signals = signals.concat(data.toString().trim().split('\n'))
      })

      prog.on('exit', function(code) {
        EQ (code, 3)
        //console.dir(signals)
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

  describe('uncaughException', function() {
    describe('> when set to true', function() {
      it('should catch uncaughtException', function(done) {
        var errData = ''
        var progPath = P('test/resources/uncaughtException-true')
        var prog = spawn(progPath, [])
        //console.dir(prog)

        prog.stdout.on('data', function(data) {
          //console.log(colors.cyan(data.toString()))
        })

        prog.stderr.on('data', function(data) {
          //console.error(colors.red(data.toString()))
          errData += data.toString().trim()
        })

        prog.on('exit', function(code) {
          EQ (code, 70)
          T (errData.indexOf('uncaughtException') >= 0)
          T (errData.indexOf('UNCAUGHT SELF') >= 0)
          done()
        })
      })
    })

    describe('> when set to false', function() {
      it('should catch uncaughtException', function(done) {
        var errData = ''
        var progPath = P('test/resources/uncaughtException-false')
        var prog = spawn(progPath, [])
        //console.dir(prog)

        prog.stdout.on('data', function(data) {
          //console.log(colors.cyan(data.toString()))
        })

        prog.stderr.on('data', function(data) {
          //console.error(colors.red(data.toString()))
          errData += data.toString().trim()
        })

        prog.on('exit', function(code) {
          EQ (code, 1)
          T (errData.indexOf('CAUGHT: uncaughtException') < 0)
          T (errData.indexOf('UNCAUGHT SELF') >= 0)
          done()
        })
      })
    })
  })
})

