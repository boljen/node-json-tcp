# json-tcp (NodeJS)

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
    });

## License

MIT
