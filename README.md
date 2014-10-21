# json-tcp (NodeJS)

<<<<<<< HEAD
A JSON-based TCP communication protocol. It basically adds functionality to the
socket object.

## Install & getting started

    npm install json-tcp

    var jsonTcp = require('json-tcp');

    // wrap a socket
    jsonTcp(socket);

## Example

From test.js:

    var jsonTcp = require('./')
      , net = require('net');

    //// SERVER CODE ////

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
    });
    s.listen(8124);


    //// CLIENT CODE ////

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
=======
This allows you to communicate through JSON-based messages.

More configuration and error-handling will be implemented in the future.

**Important:** This is built on top of the BSON package and as such requires
node-gyp compiling when installing.

## Example

    // Get packages
    var jsonTcp = require('json-tcp')
      , net = require('net');

    // Setup a server
    net.createServer(function(connection) {

      // initialize jsonTcp on the socket
      jsonTcp(connection);

      // Get json messages (per message)
      connection.on('message', function(msg) {
        // parse your json
        console.log(msg);
      });

    }).listen(8124);

    // Setup a client
    var client = net.connect({port: 8124});

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

## License

MIT
