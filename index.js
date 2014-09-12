
var godot = require('godot');

exports.name = 'godot';

exports.attach = function () {
  //
  // Remark: initialize the godot client for sending all the things
  //
  var options = this.config.get('godot');

  this.godot = godot.createClient(options);

};

//
// Remark: Make sure we connect so we can begin to send metrics over other
// plugins
//
exports.init = function (done) {
  var returned = false;

  this.godot.on('connect', function () {
    returned = true;
    this.emit('godot:connected', 'info')
    done();
  }.bind(this));

  //
  // Make sure this never happens unless we are initializing
  //
  this.godot.on('error', function (err) {
    if (!returned) {
      return done(err);
    }
    this.emit('godot:error', 'error', {
      stack: err.stack,
      message: err.message
    })
  }.bind(this));

  this.godot.connect();
};
