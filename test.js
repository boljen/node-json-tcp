var jsonTcp = require('./')
  , net = require('net');

// Setup a server
<<<<<<< HEAD
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


=======
net.createServer(function(connection) {

  // initialize jsonTcp on the socket
  jsonTcp(connection);

  // Get json messages (per message)
  connection.on('message', function(msg) {
    // parse your json
    console.log(msg);
  });

}).listen(8124);
>>>>>>> cfefee04ffa669f3219afa2fbd9f0af61c1d2a8b

// Setup a client
var client = net.connect({port: 8124});

<<<<<<< HEAD
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
=======
// Initialize jsonTcp on the socket
jsonTcp(client);

// Get json messages, not implemented in example
client.on('message', function(msg) {
  console.log(msg);
});

// Send an example message
client.send({
  test: true
>>>>>>> cfefee04ffa669f3219afa2fbd9f0af61c1d2a8b
});
