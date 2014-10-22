var jsonTcp = require('./')
  , net = require('net');


var basics = net.createServer(function(c) {
  jsonTcp.basic(c);

  c.on('message', function(msg) {
    console.log(msg);
    c.unref();
    basics.unref();
    basics.unref();
  });

});
basics.listen(1234);

// Setup a client
var basicc = net.connect({port: 1234});
jsonTcp.basic(basicc);

basicc.send({
  json: 'message'
});
basicc.unref();

basics.on('error', console.log);
basicc.on('error', console.log);



// Setup a server
var s = net.createServer(function(connection) {

  // Initialize the server-side socket
  jsonTcp.full(connection, {
    stateAdded: true
  });
  connection.on('error', console.log);
  // add a message parser to the message 'test'
  connection.addParser('test', function(msg, state) {

    console.log('State: ', state);

    // >> Hello
    console.log(msg.getData());

    // Take the message object and reply
    msg.reply({
      message: 'world'
    });


    connection.unref();
  });


  // Here we test a command in the client side bundle
  setTimeout(function() {
    connection.send('test');
  }, 30)
});
s.listen(8124);
s.unref();
// Setup a client
var client = net.connect({port: 8124});

// Initialize the client-side socket
jsonTcp.full(client);

// Send message type 'test' and set data to 'hello'
client.send('test','hello',function(msg) {

    // >> World
    console.log(msg.getData().message);
});

// A bundle holds a list of commands inside an object and can easily be shared
// between different sockets.
client.addParserBundle({
  test: function(msg) {
    console.log('bundled message parsers also works');
    client.unref();
    s.unref();
  }
});

client.on('error', console.log);
