
var Emitter = require('..');

function Custom() {
  Emitter.call(this)
}

Custom.prototype.__proto__ = Emitter.prototype;

describe('Custom', function(){
  describe('with Emitter.call(this)', function(){
    it('should work', function(done){
      var emitter = new Custom;
      emitter.on('foo', done);
      emitter.emit('foo');
    })
  })
})

describe('Emitter', function(){
  describe('.on(event, fn)', function(){
    it('should add listeners', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.on('foo', function(val){
        calls.push('one', val);
      });

      emitter.on('foo', function(val){
        calls.push('two', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('bar', 1);
      emitter.emit('foo', 2);

      calls.should.eql([ 'one', 1, 'two', 1, 'one', 2, 'two', 2 ]);
    })

  <<<<<<< add/handles
    it('should return a subscription', function(){
      var emitter = new Emitter;
      var calls = [];

      var foo = emitter.on('foo', function(){
        calls.push('foo');
      });

      emitter.emit('foo');
      foo.cancel();
      emitter.emit('foo');

      calls.should.eql(['foo']);
  =======
    it('should add listeners for events which are same names with methods of Object.prototype', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.on('constructor', function(val){
        calls.push('one', val);
      });

      emitter.on('__proto__', function(val){
        calls.push('two', val);
      });

      emitter.emit('constructor', 1);
      emitter.emit('__proto__', 2);

      calls.should.eql([ 'one', 1, 'two', 2 ]);
  >>>>>>> master
    })
  })

  describe('.once(event, fn)', function(){
    it('should add a single-shot listener', function(){
      var emitter = new Emitter;
      var calls = [];

      emitter.once('foo', function(val){
        calls.push('one', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('foo', 2);
      emitter.emit('foo', 3);
      emitter.emit('bar', 1);

      calls.should.eql([ 'one', 1 ]);
    })

    it('should return a subscription', function(){
      var emitter = new Emitter;
      var calls = [];
      
      var foo = emitter.on('foo', function(){
        calls.push('foo');
      });
      
      foo.cancel();
      emitter.emit('foo');
      
      calls.should.eql([]);
    })
  })

  describe('.off(event, fn)', function(){
    it('should remove a listener', function(){
      var emitter = new Emitter;
      var calls = [];

      function one() { calls.push('one'); }
      function two() { calls.push('two'); }

      emitter.on('foo', one);
      emitter.on('foo', two);
      emitter.off('foo', two);

      emitter.emit('foo');

      calls.should.eql([ 'one' ]);
    })

    it('should work with .once()', function(){
      var emitter = new Emitter;
      var calls = [];

      function one() { calls.push('one'); }

      emitter.once('foo', one);
      emitter.once('fee', one);
      emitter.off('foo', one);

      emitter.emit('foo');

      calls.should.eql([]);
    })

    it('should work when called from an event', function(){
      var emitter = new Emitter
        , called
      function b () {
        called = true;
      }
      emitter.on('tobi', function () {
        emitter.off('tobi', b);
      });
      emitter.on('tobi', b);
      emitter.emit('tobi');
      called.should.be.true;
      called = false;
      emitter.emit('tobi');
      called.should.be.false;
    });
  })

  describe('.off(event)', function(){
    it('should remove all listeners for an event', function(){
      var emitter = new Emitter;
      var calls = [];

      function one() { calls.push('one'); }
      function two() { calls.push('two'); }

      emitter.on('foo', one);
      emitter.on('foo', two);
      emitter.off('foo');

      emitter.emit('foo');
      emitter.emit('foo');

      calls.should.eql([]);
    })

    it('should remove event array to avoid memory leak', function() {
      var emitter = new Emitter;
      var calls = [];

      function cb() {}

      emitter.on('foo', cb);
      emitter.off('foo', cb);

      emitter._callbacks.should.not.have.property('$foo');
    })

    it('should only remove the event array when the last subscriber unsubscribes', function() {
      var emitter = new Emitter;
      var calls = [];

      function cb1() {}
      function cb2() {}

      emitter.on('foo', cb1);
      emitter.on('foo', cb2);
      emitter.off('foo', cb1);

      emitter._callbacks.should.have.property('$foo');
    })
  })

  describe('.off()', function(){
    it('should remove all listeners', function(){
      var emitter = new Emitter;
      var calls = [];

      function one() { calls.push('one'); }
      function two() { calls.push('two'); }

      emitter.on('foo', one);
      emitter.on('bar', two);

      emitter.emit('foo');
      emitter.emit('bar');

      emitter.off();

      emitter.emit('foo');
      emitter.emit('bar');

      calls.should.eql(['one', 'two']);
    })
  })

  describe('.listeners(event)', function(){
    describe('when handlers are present', function(){
      it('should return an array of callbacks', function(){
        var emitter = new Emitter;
        function foo(){}
        emitter.on('foo', foo);
        emitter.listeners('foo').should.eql([foo]);
      })
    })

    describe('when no handlers are present', function(){
      it('should return an empty array', function(){
        var emitter = new Emitter;
        emitter.listeners('foo').should.eql([]);
      })
    })
  })

  describe('.hasListeners(event)', function(){
    describe('when handlers are present', function(){
      it('should return true', function(){
        var emitter = new Emitter;
        emitter.on('foo', function(){});
        emitter.hasListeners('foo').should.be.true;
      })
    })

    describe('when no handlers are present', function(){
      it('should return false', function(){
        var emitter = new Emitter;
        emitter.hasListeners('foo').should.be.false;
      })
    })
  })
})

describe('Emitter(obj)', function(){
  it('should mixin', function(done){
    var proto = {};
    Emitter(proto);
    proto.on('something', done);
    proto.emit('something');
  })
})
