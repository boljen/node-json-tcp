# basic implementation

The basic implementation doesn't have a lot to it, so it's documentation is set
up as a walkthrough.

## Prerequisites

Below are the prerequisites for this walkthrough. While here we use a socket,
you can also use other streams to bind.

    var jsonTcp = require('json-tcp')
      , socket = getSocketSomehow();

## Init

First you need to initialize a socket to parse JSON messages:

    jsonTcp.init(socket);

## Created API

Adds two things to your socket:

    // Send a message
    socket.send(jsonMessage);

    // Receive a message
    socket.on('message', function(jsonMessage) {
        // Your received json message
    });

## Errors

An error event will be called when the received json message is invalid.

    socket.on('error', function(error) {
      if (error.code === 'INVALID_MESSAGE') {
        // error.buffer
      }
    });

## Custom implementation

Adding your own custom implementation on top of this is quite easy:

    // Override this method with your own implementation
    socket._parseMessage = function(message) {
      this.emit('message', message);
    }

    // Remove or override this method with your own implementation
    socket.send = function(obj) {
      socket._send(obj);
    }

## Custom streams

Note that you can also provide two streams, one to read, and one to write. This
can be useful if you use a pipe pattern to process:

    var inboundStream = decryptBufferStream();
    var outboundStream = encryptBufferStream();

    socket.pipe(inboundStream);
    decrypt.pipe(outboundStream);

    jsonTcp.init(inboundStream, outboundStream);

Then you need to call the API on their respective streams
