var client = require('../../../')
	, ges = require('ges-test-helper')
	, uuid = require('node-uuid')
	, async = require('async')
	, createTestEvent = require('../../createTestEvent')

describe('event_store_connection_should', function() {
	var es

	before(function(done) {
		ges({ tcpPort: 5000 }, function(err, memory) {
			if(err) return done(err)

			es = memory
			done()
		})
	})

  it('not_throw_on_close_if_connect_was_not_called', function(done) {
		var connection = client({
					port: 5000
				, requireExplicitConnect: true
				})

		connection.close(function(err) {
			(err === null).should.be.true
			done()
		})
  })

  it('not_throw_on_close_if_called_multiple_times', function(done) {
		client({ port: 5000 }, function(err, connection) {
			if(err) return done(err)
			connection.close(function(err) {
				if(err) return done(err)
				connection.close(function(err) {
					if(err) return done(err)
					(err === null).should.be.true
					done()
				})
			})
		})
  })

  //it('throw_on_connect_called_more_than_once')
  //it('throw_on_connect_called_after_close')

  it('throw_invalid_operation_on_every_api_call_if_connect_was_not_called', function(done) {
  	var connection = client({
					port: 5000
				, requireExplicitConnection: true
				})
  		, s = 'stream'
			, events = [ createTestEvent() ]
  	async.series([
  		function(cb) {
			/*
  			connection.deleteStream(s, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  		/*
  			connection.appendToStream(s, 0, events, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  			connection.readStreamEventsForward(s, { start: 0, count: 1 }, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
  		}
  	, function(cb) {
  		/*
  			connection.readStreamEventsBackward(s, { start: 0, count: 1 }, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  		/*
  			connection.readAllEventsForward(client.position.start, { start: 0, count: 1 }, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  		/*
  			connection.readAllEventsBackward(client.position.end, { start: 0, count: 1 }, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  		/*
  			connection.startTransaction(s, 0, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  		/*
  			connection.subscribeToStream(s, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
  	, function(cb) {
  		/*
  			connection.subscribeToAll(false, function(err) {
  				(err === null).should.be.false
  				cb()
  			})
			*/
  			setImmediate(cb)
  		}
		], function() {
			connection.close(done)
		})
  })
	
  after(function(done) {
  	es.on('exit', function(code, signal) {
	  	done()
  	})
  	es.on('error', done)
  	es.kill()
  })
})
