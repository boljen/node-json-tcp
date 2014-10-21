var jsonTcp = require('./')
  , net = require('net');

// Setup a server
var s = net.createServer(function(connection) {

  // Initialize the server-side socket
  jsonTcp(connection);

  // add a message parser to the message 'test'
  connection.addParser('test', function(msg) {

    // >> Hello
    console.log(msg.getData());

    // Take the message object and reply
    msg.reply({
      message: 'world'
    });

  });


  // Here we test a command in the client side bundle
  setTimeout(function() {
    connection.send('test');
  }, 30)

  connection.unref();
});
s.listen(8124);

// Setup a client
var client = net.connect({port: 8124});

// Initialize the client-side socket
jsonTcp(client);

// Send message type 'test' and set data to 'hello'
client.send('test','hello',function(msg) {

    // >> World
    console.log(msg.getData().message);
});

// A bundle holds a list of commands inside an object and can easily be shared
// between different sockets.
client.addParserBundle({
  test: function(msg) {
    console.log('bundled message parsers also work');
  }
});
