var framework = require('javascript-protocol-framework')
  , net = require('net')
  , protocol = require('./../../lib/protocol');

var proto = new framework.Protocol();


net.createServer(function(s) {
  var ses = new framework.Session({
    protocol: proto
  });
  protocol(ses, s);
  ses.send({
    type: 'test',
    data: 'hello',
  });
}).listen(80);

var c = net.connect(80);
var ses = new framework.Session({
  protocol: proto
});
ses.on('test', function(msg, sess) {
  console.log(msg.data)
})
protocol(ses, c);
